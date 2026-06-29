const cron = require("node-cron");
const sql = require("mssql");
const connectDB = require("../config/database");

// Hàm kiểm tra và sinh cảnh báo tồn kho tự động
const scanInventoryWarnings = async () => {
  try {
    const pool = await connectDB();
    console.log("[CronJob] Bắt đầu quét tồn kho để tìm cảnh báo lúc:", new Date());

    // 1. Quét cảnh báo Min/Max (Dưới định mức / Vượt định mức)
    // Lấy tồn vật lý gộp theo kho + mặt hàng
    const resultMinMax = await pool.request().query(`
      SELECT 
        t.MA_MAT_HANG, 
        t.MA_VI_TRI, 
        v.MA_KHO, 
        SUM(t.SO_LUONG) AS TONG_TON,
        c.MUC_TON_TOI_THIEU,
        c.MUC_TON_TOI_DA
      FROM TonTheoViTri t
      JOIN ViTriKho v ON t.MA_VI_TRI = v.MA_VI_TRI
      JOIN CauHinhDinhMucTon c ON t.MA_MAT_HANG = c.MA_MAT_HANG AND v.MA_KHO = c.MA_KHO
      GROUP BY t.MA_MAT_HANG, t.MA_VI_TRI, v.MA_KHO, c.MUC_TON_TOI_THIEU, c.MUC_TON_TOI_DA
    `);

    for (const row of resultMinMax.recordset) {
      if (row.MUC_TON_TOI_THIEU && row.TONG_TON < row.MUC_TON_TOI_THIEU) {
        // Sinh cảnh báo Dưới định mức
        await createAlert(pool, {
          kho: row.MA_KHO,
          mh: row.MA_MAT_HANG,
          vitri: row.MA_VI_TRI,
          loai: "Dưới định mức",
          uutien: "Cao",
          slhientai: row.TONG_TON,
          nguong: row.MUC_TON_TOI_THIEU,
          mota: "Tồn kho thực tế thấp hơn định mức tối thiểu"
        });
      } else if (row.MUC_TON_TOI_DA && row.TONG_TON > row.MUC_TON_TOI_DA) {
        // Sinh cảnh báo Vượt định mức
        await createAlert(pool, {
          kho: row.MA_KHO,
          mh: row.MA_MAT_HANG,
          vitri: row.MA_VI_TRI,
          loai: "Vượt định mức",
          uutien: "Trung bình",
          slhientai: row.TONG_TON,
          nguong: row.MUC_TON_TOI_DA,
          mota: "Tồn kho thực tế cao hơn định mức tối đa"
        });
      }
    }

    // 2. Quét cảnh báo Cận date / Quá date
    const resultDate = await pool.request().query(`
      SELECT 
        l.MA_LO_HANG, 
        l.MA_MAT_HANG, 
        l.HAN_SU_DUNG,
        t.MA_VI_TRI,
        v.MA_KHO,
        t.SO_LUONG,
        c.NGUONG_CAN_HAN
      FROM LoHang l
      JOIN TonTheoViTri t ON l.MA_LO_HANG = t.MA_LO_HANG
      JOIN ViTriKho v ON t.MA_VI_TRI = v.MA_VI_TRI
      LEFT JOIN CauHinhDinhMucTon c ON l.MA_MAT_HANG = c.MA_MAT_HANG AND v.MA_KHO = c.MA_KHO
      WHERE t.SO_LUONG > 0 AND l.HAN_SU_DUNG IS NOT NULL
    `);

    const now = new Date();
    for (const row of resultDate.recordset) {
      const hsd = new Date(row.HAN_SU_DUNG);
      const diffDays = Math.ceil((hsd - now) / (1000 * 60 * 60 * 24));
      
      const nguongCanHan = row.NGUONG_CAN_HAN || 30; // Mặc định 30 ngày nếu không cấu hình

      if (diffDays < 0) {
        // Đã quá hạn
        await createAlert(pool, {
          kho: row.MA_KHO,
          mh: row.MA_MAT_HANG,
          lo: row.MA_LO_HANG,
          vitri: row.MA_VI_TRI,
          loai: "Quá hạn sử dụng",
          uutien: "Nghiêm trọng",
          slhientai: row.SO_LUONG,
          nguong: 0,
          mota: `Hàng hóa đã quá hạn sử dụng (${Math.abs(diffDays)} ngày)`
        });
      } else if (diffDays <= nguongCanHan) {
        // Cận hạn
        await createAlert(pool, {
          kho: row.MA_KHO,
          mh: row.MA_MAT_HANG,
          lo: row.MA_LO_HANG,
          vitri: row.MA_VI_TRI,
          loai: "Cận hạn sử dụng",
          uutien: "Cao",
          slhientai: row.SO_LUONG,
          nguong: nguongCanHan,
          mota: `Hàng hóa sắp hết hạn trong ${diffDays} ngày tới (Ngưỡng: ${nguongCanHan} ngày)`
        });
      }
    }

    console.log("[CronJob] Quét tồn kho hoàn tất!");
  } catch (error) {
    console.error("[CronJob] Lỗi khi quét cảnh báo tồn kho:", error);
  }
};

// Hàm phụ trợ insert Cảnh Báo
const createAlert = async (pool, data) => {
  try {
    // Generate random MA_CANH_BAO for simplicity (e.g. CB_12345)
    const maCanhBao = "CB_" + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    
    // Kiểm tra xem cảnh báo tương tự đã tồn tại chưa (tránh spam)
    const exist = await pool.request()
      .input("kho", sql.Char(10), data.kho)
      .input("mh", sql.Char(10), data.mh)
      .input("lo", sql.Char(10), data.lo || null)
      .input("loai", sql.NVarChar(50), data.loai)
      .query(`
        SELECT COUNT(1) AS count FROM CanhBaoTonKho 
        WHERE MA_KHO = @kho AND MA_MAT_HANG = @mh 
        AND (MA_LO_HANG = @lo OR (MA_LO_HANG IS NULL AND @lo IS NULL))
        AND LOAI_CANH_BAO = @loai AND TRANG_THAI_CANH_BAO = N'Chờ xử lý'
      `);
      
    if (exist.recordset[0].count > 0) return; // Đã có cảnh báo đang chờ xử lý

    await pool.request()
      .input("ma", sql.Char(10), maCanhBao)
      .input("kho", sql.Char(10), data.kho)
      .input("mh", sql.Char(10), data.mh)
      .input("lo", sql.Char(10), data.lo || null)
      .input("vitri", sql.Char(10), data.vitri || null)
      .input("loai", sql.NVarChar(50), data.loai)
      .input("uutien", sql.NVarChar(30), data.uutien)
      .input("sl", sql.Int, data.slhientai)
      .input("nguong", sql.Int, data.nguong)
      .input("thoigiam", sql.DateTime2(0), new Date())
      .input("trangthai", sql.NVarChar(50), 'Chờ xử lý')
      .input("mota", sql.NVarChar(255), data.mota)
      .query(`
        INSERT INTO CanhBaoTonKho (MA_CANH_BAO, MA_KHO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, LOAI_CANH_BAO, MUC_DO_UU_TIEN, SO_LUONG_HIEN_TAI, NGUONG_CANH_BAO, THOI_DIEM_PHAT_SINH, TRANG_THAI_CANH_BAO, MO_TA)
        VALUES (@ma, @kho, @mh, @lo, @vitri, @loai, @uutien, @sl, @nguong, @thoigiam, @trangthai, @mota)
      `);
  } catch (e) {
    console.error("Lỗi tạo cảnh báo:", e.message);
  }
};

// Đăng ký job chạy mỗi 00:00 (nửa đêm)
const initCronJobs = () => {
  cron.schedule("0 0 * * *", () => {
    scanInventoryWarnings();
  });
  console.log("Cron Jobs đã được khởi tạo.");
};

module.exports = { initCronJobs, scanInventoryWarnings };
