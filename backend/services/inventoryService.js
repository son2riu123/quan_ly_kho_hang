const sql = require("mssql");
const connectDB = require("../config/database");

const inventoryService = {
  /**
   * Xử lý giao dịch Nhập kho liên hoàn (Import Goods Transaction)
   * 1. Cập nhật bảng ChiTietPhieuNhapKho (hoặc tạo Phiếu)
   * 2. Cộng số lượng vào TonTheoViTri
   * 3. Ghi nhận Biến động tồn kho (BienDongTonKho)
   * 4. Ghi nhận Thẻ kho (TheKho & DongTheKho)
   */
  processImport: async (data, nguoiThucHien) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      
      // Xử lý từng dòng chi tiết phiếu nhập
      if (data.details && data.details.length > 0) {
        for (let i = 0; i < data.details.length; i++) {
          const detail = data.details[i];
          const maViTri = detail.MA_VI_TRI || 'VT_DEFAULT'; // Vị trí mặc định nếu chưa gán
          
          // --- BƯỚC 1: Cập nhật TỒN THEO VỊ TRÍ ---
          const requestTon = new sql.Request(transaction);
          const checkTon = await requestTon
            .input("mh", sql.Char(10), detail.MA_MAT_HANG)
            .input("lo", sql.Char(10), detail.MA_LO_HANG || null)
            .input("vitri", sql.Char(10), maViTri)
            .query(`
              SELECT MA_TON_VI_TRI, SO_LUONG FROM TonTheoViTri 
              WHERE MA_MAT_HANG = @mh 
                AND (MA_LO_HANG = @lo OR (MA_LO_HANG IS NULL AND @lo IS NULL))
                AND MA_VI_TRI = @vitri
            `);

          let maTonViTri = "";
          if (checkTon.recordset.length > 0) {
            // Đã có tồn -> Cộng dồn
            maTonViTri = checkTon.recordset[0].MA_TON_VI_TRI;
            const updateTon = new sql.Request(transaction);
            await updateTon
              .input("maTon", sql.Char(10), maTonViTri)
              .input("slNhap", sql.Int, detail.SO_LUONG_THUC_NHAP)
              .query(`UPDATE TonTheoViTri SET SO_LUONG = SO_LUONG + @slNhap, NGAY_CAP_NHAT_GAN_NHAT = SYSDATETIME() WHERE MA_TON_VI_TRI = @maTon`);
          } else {
            // Chưa có tồn -> Tạo mới
            maTonViTri = "TON_" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            const insertTon = new sql.Request(transaction);
            await insertTon
              .input("maTon", sql.Char(10), maTonViTri)
              .input("mh", sql.Char(10), detail.MA_MAT_HANG)
              .input("lo", sql.Char(10), detail.MA_LO_HANG || null)
              .input("vitri", sql.Char(10), maViTri)
              .input("ctpnk", sql.Char(10), detail.MA_CHI_TIET_PNK || null)
              .input("sl", sql.Int, detail.SO_LUONG_THUC_NHAP)
              .input("trangthai", sql.NVarChar(50), 'Bình thường')
              .query(`
                INSERT INTO TonTheoViTri (MA_TON_VI_TRI, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_CHI_TIET_PNK, SO_LUONG, TRANG_THAI_TON, NGAY_DUA_VAO, NGAY_CAP_NHAT_GAN_NHAT)
                VALUES (@maTon, @mh, @lo, @vitri, @ctpnk, @sl, @trangthai, SYSDATETIME(), SYSDATETIME())
              `);
          }

          // --- BƯỚC 2: Ghi nhận BIẾN ĐỘNG TỒN KHO ---
          const maBienDong = "BD_" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
          const requestBD = new sql.Request(transaction);
          await requestBD
            .input("maBD", sql.Char(10), maBienDong)
            .input("mh", sql.Char(10), detail.MA_MAT_HANG)
            .input("lo", sql.Char(10), detail.MA_LO_HANG || null)
            .input("vitri", sql.Char(10), maViTri)
            .input("ct", sql.Char(10), data.MA_PHIEU_NHAP_KHO)
            .input("loaict", sql.NVarChar(50), 'Phiếu Nhập Kho')
            .input("loaibd", sql.NVarChar(50), 'Nhập mới')
            .input("sl", sql.Int, detail.SO_LUONG_THUC_NHAP)
            .input("nguoi", sql.Char(10), nguoiThucHien)
            .query(`
              INSERT INTO BienDongTonKho (MA_BIEN_DONG, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_CHUNG_TU, LOAI_CHUNG_TU, LOAI_BIEN_DONG, SO_LUONG, THOI_GIAN, NGUOI_THUC_HIEN)
              VALUES (@maBD, @mh, @lo, @vitri, @ct, @loaict, @loaibd, @sl, SYSDATETIME(), @nguoi)
            `);

          // --- BƯỚC 3: Ghi nhận THẺ KHO ---
          // Kiểm tra Thẻ Kho của Mặt Hàng đã có chưa
          const requestThe = new sql.Request(transaction);
          const checkThe = await requestThe
            .input("mh", sql.Char(10), detail.MA_MAT_HANG)
            .query(`SELECT MA_THE_KHO FROM TheKho WHERE MA_MAT_HANG = @mh`);
          
          let maTheKho = "";
          if (checkThe.recordset.length > 0) {
            maTheKho = checkThe.recordset[0].MA_THE_KHO;
          } else {
            maTheKho = "TK_" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            const insertThe = new sql.Request(transaction);
            await insertThe
              .input("maThe", sql.Char(10), maTheKho)
              .input("mh", sql.Char(10), detail.MA_MAT_HANG)
              .input("nguoi", sql.Char(10), nguoiThucHien)
              .query(`
                INSERT INTO TheKho (MA_THE_KHO, MA_MAT_HANG, NGAY_MO_THE, NGUOI_LAP_THE, TRANG_THAI)
                VALUES (@maThe, @mh, SYSDATETIME(), @nguoi, N'Đang sử dụng')
              `);
          }

          // Ghi Dòng thẻ kho (DongTheKho)
          // Lấy tồn cuối cùng để cộng dồn
          const requestTonThe = new sql.Request(transaction);
          const lastTon = await requestTonThe
            .input("maThe", sql.Char(10), maTheKho)
            .query(`SELECT TOP 1 SO_LUONG_TON FROM DongTheKho WHERE MA_THE_KHO = @maThe ORDER BY NGAY_GHI DESC`);
          
          let tonHienTai = 0;
          if (lastTon.recordset.length > 0) {
            tonHienTai = lastTon.recordset[0].SO_LUONG_TON;
          }
          const tonSauCung = tonHienTai + detail.SO_LUONG_THUC_NHAP;

          const maDong = "DTK_" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
          const insertDong = new sql.Request(transaction);
          await insertDong
            .input("maDong", sql.Char(10), maDong)
            .input("maThe", sql.Char(10), maTheKho)
            .input("ct", sql.Char(10), data.MA_PHIEU_NHAP_KHO)
            .input("loaict", sql.NVarChar(50), 'Phiếu Nhập Kho')
            .input("slNhap", sql.Int, detail.SO_LUONG_THUC_NHAP)
            .input("slTon", sql.Int, tonSauCung)
            .input("nguoi", sql.Char(10), nguoiThucHien)
            .query(`
              INSERT INTO DongTheKho (MA_DONG_THE_KHO, MA_THE_KHO, NGAY_GHI, MA_CHUNG_TU, LOAI_CHUNG_TU, SO_LUONG_NHAP, SO_LUONG_XUAT, SO_LUONG_TON, NGUOI_GHI)
              VALUES (@maDong, @maThe, SYSDATETIME(), @ct, @loaict, @slNhap, 0, @slTon, @nguoi)
            `);
        }
      }

      await transaction.commit();
      return true;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

module.exports = inventoryService;
