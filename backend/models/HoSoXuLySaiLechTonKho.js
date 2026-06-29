const sql = require("mssql");
const connectDB = require("../config/database");

const HoSoXuLySaiLechTonKho = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT h.*,
             nv1.HO_TEN AS TEN_NGUOI_PHAT_HIEN,
             nv2.HO_TEN AS TEN_NGUOI_XU_LY
      FROM HoSoXuLySaiLechTonKho h
      LEFT JOIN NhanVien nv1 ON h.NGUOI_PHAT_HIEN = nv1.MA_NHAN_VIEN
      LEFT JOIN NhanVien nv2 ON h.NGUOI_XU_LY = nv2.MA_NHAN_VIEN
    `);
    return result.recordset;
  },


  getByMa: async (maHoSo) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maHoSo", sql.Char(10), maHoSo)
      .query(`
        -- Truy vấn 1: Lấy thông tin Master (Hồ Sơ)
        SELECT h.*,
               nv1.HO_TEN AS TEN_NGUOI_PHAT_HIEN,
               nv2.HO_TEN AS TEN_NGUOI_XU_LY
        FROM HoSoXuLySaiLechTonKho h
        LEFT JOIN NhanVien nv1 ON h.NGUOI_PHAT_HIEN = nv1.MA_NHAN_VIEN
        LEFT JOIN NhanVien nv2 ON h.NGUOI_XU_LY = nv2.MA_NHAN_VIEN
        WHERE h.MA_HO_SO = @maHoSo;

        -- Truy vấn 2: Lấy thông tin Detail (Danh sách mặt hàng sai lệch)
        SELECT * FROM ChiTietSaiLechTonKho WHERE MA_HO_SO = @maHoSo;
      `);
    
  
    const hoSo = result.recordsets[0][0]; // Lấy bản ghi đầu tiên của câu Query 1
    if (hoSo) {
      hoSo.ChiTiet = result.recordsets[1]; // Gắn kết quả của câu Query 2 vào
    }
    return hoSo;
  },

  // Đã nâng cấp: Sử dụng Transaction gộp lưu Hồ sơ và Chi tiết
  create: async (data, chiTietList) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);

    try {
      // 1. Bắt đầu phiên giao dịch
      await transaction.begin();

      // 2. Tạo Request dùng chung cho Transaction để thêm Master
      const requestMaster = new sql.Request(transaction);
      await requestMaster
        .input("maHoSo", sql.Char(10), data.MA_HO_SO)
        .input("nguoiPhatHien", sql.Char(10), data.NGUOI_PHAT_HIEN)
        .input("thoiDiemPhatHien", sql.DateTime2, data.THOI_DIEM_PHAT_HIEN || new Date())
        .input("nguonPhatHien", sql.NVarChar(50), data.NGUON_PHAT_HIEN)
        .input("moTaChung", sql.NVarChar(255), data.MO_TA_CHUNG)
        .input("trangThaiHoSo", sql.NVarChar(30), data.TRANG_THAI_HO_SO)
        .input("nguoiXuLy", sql.Char(10), data.NGUOI_XU_LY)
        .input("thoiDiemXuLy", sql.DateTime2, data.THOI_DIEM_XU_LY)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
        .query(`
          INSERT INTO HoSoXuLySaiLechTonKho
            (MA_HO_SO, NGUOI_PHAT_HIEN, THOI_DIEM_PHAT_HIEN, NGUON_PHAT_HIEN,
             MO_TA_CHUNG, TRANG_THAI_HO_SO, NGUOI_XU_LY, THOI_DIEM_XU_LY, GHI_CHU)
          VALUES
            (@maHoSo, @nguoiPhatHien, @thoiDiemPhatHien, @nguonPhatHien,
             @moTaChung, @trangThaiHoSo, @nguoiXuLy, @thoiDiemXuLy, @ghiChu)
        `);

      // 3. Lặp qua danh sách chi tiết (nếu có) để insert từng dòng
      if (chiTietList && Array.isArray(chiTietList) && chiTietList.length > 0) {
        for (let item of chiTietList) {
            // Mỗi lệnh Query trong vòng lặp phải khởi tạo một Request mới nằm trong Transaction
            const requestDetail = new sql.Request(transaction);
            await requestDetail
              .input("maChiTiet", sql.Char(10), item.MA_CHI_TIET_SAI_LECH)
              .input("maHoSo", sql.Char(10), data.MA_HO_SO) // Tham chiếu đúng MA_HO_SO vừa insert
              .input("maMatHang", sql.Char(10), item.MA_MAT_HANG)
              .input("maLoHang", sql.Char(10), item.MA_LO_HANG)
              .input("maViTri", sql.Char(10), item.MA_VI_TRI)
              .input("trangThaiHang", sql.NVarChar(50), item.TRANG_THAI_HANG)
              .input("maDonViTinh", sql.Char(10), item.MA_DON_VI_TINH)
              .input("slHeThong", sql.Int, item.SO_LUONG_HE_THONG)
              .input("slThucTe", sql.Int, item.SO_LUONG_THUC_TE)
              .input("slSaiLech", sql.Int, item.SO_LUONG_SAI_LECH)
              .input("loaiSaiLech", sql.NVarChar(100), item.LOAI_SAI_LECH)
              .input("moTaSaiLech", sql.NVarChar(255), item.MO_TA_SAI_LECH)
              .input("minhChung", sql.NVarChar(255), item.MINH_CHUNG)
              .query(`
                INSERT INTO ChiTietSaiLechTonKho
                  (MA_CHI_TIET_SAI_LECH, MA_HO_SO, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI,
                   TRANG_THAI_HANG, MA_DON_VI_TINH, SO_LUONG_HE_THONG, SO_LUONG_THUC_TE,
                   SO_LUONG_SAI_LECH, LOAI_SAI_LECH, MO_TA_SAI_LECH, MINH_CHUNG)
                VALUES
                  (@maChiTiet, @maHoSo, @maMatHang, @maLoHang, @maViTri,
                   @trangThaiHang, @maDonViTinh, @slHeThong, @slThucTe,
                   @slSaiLech, @loaiSaiLech, @moTaSaiLech, @minhChung)
              `);
        }
      }

      // 4. Nếu toàn bộ (Hồ sơ + Mảng Chi Tiết) lưu thành công, xác nhận Commit
      await transaction.commit();
      return { success: true, message: "Thêm hồ sơ và các chi tiết sai lệch thành công!" };

    } catch (error) {
      // 5. Nếu có LỖI xảy ra ở bất kỳ dòng nào, hủy bỏ toàn bộ thay đổi (Rollback)
      await transaction.rollback();
      console.error("Lỗi Transaction:", error);
      throw new Error("Lỗi lưu dữ liệu. Đã rollback toàn bộ giao dịch.");
    }
  },

  update: async (maHoSo, data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    try {
      await transaction.begin();

      const requestUpdate = new sql.Request(transaction);
      await requestUpdate
        .input("maHoSo", sql.Char(10), maHoSo)
        .input("trangThaiHoSo", sql.NVarChar(30), data.TRANG_THAI_HO_SO)
        .input("nguoiXuLy", sql.Char(10), data.NGUOI_XU_LY)
        .input("thoiDiemXuLy", sql.DateTime2, data.THOI_DIEM_XU_LY || new Date())
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
        .query(`
          UPDATE HoSoXuLySaiLechTonKho
          SET TRANG_THAI_HO_SO = @trangThaiHoSo, NGUOI_XU_LY = @nguoiXuLy,
              THOI_DIEM_XU_LY = @thoiDiemXuLy, GHI_CHU = @ghiChu
          WHERE MA_HO_SO = @maHoSo
        `);

      if (data.TRANG_THAI_HO_SO === 'Đã hoàn thành') {
        const requestGetDetails = new sql.Request(transaction);
        const detailsResult = await requestGetDetails
          .input("maHoSo", sql.Char(10), maHoSo)
          .query("SELECT * FROM ChiTietSaiLechTonKho WHERE MA_HO_SO = @maHoSo");

        for (let item of detailsResult.recordset) {
          const requestAdjustStock = new sql.Request(transaction);
          await requestAdjustStock
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG)
            .input("maViTri", sql.Char(10), item.MA_VI_TRI)
            .input("maLoHang", sql.Char(10), item.MA_LO_HANG)
            .input("slThucTe", sql.Int, item.SO_LUONG_THUC_TE)
            .query(`
              UPDATE TonTheoViTri
              SET SO_LUONG = @slThucTe, NGAY_CAP_NHAT_GAN_NHAT = GETDATE()
              WHERE MA_MAT_HANG = @maMatHang AND MA_VI_TRI = @maViTri
                AND (MA_LO_HANG = @maLoHang OR (MA_LO_HANG IS NULL AND @maLoHang IS NULL))
            `);
        }
      }

      await transaction.commit();
      return { success: true, message: "Cập nhật hồ sơ và điều chỉnh tồn kho thành công" };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  // Bạn có thể cân nhắc viết thêm Transaction cho hàm Delete nếu cần xóa cả Chi Tiết
  delete: async (maHoSo) => {
    const pool = await connectDB();
    await pool.request()
      .input("maHoSo", sql.Char(10), maHoSo)
      .query(`
        -- Xóa chi tiết trước (để tránh lỗi khóa ngoại) rồi mới xóa hồ sơ cha
        DELETE FROM ChiTietSaiLechTonKho WHERE MA_HO_SO = @maHoSo;
        DELETE FROM HoSoXuLySaiLechTonKho WHERE MA_HO_SO = @maHoSo;
      `);
    return { message: "Xóa hồ sơ xử lý sai lệch tồn kho thành công" };
  }
};

module.exports = HoSoXuLySaiLechTonKho;