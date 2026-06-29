const sql = require("mssql");
const connectDB = require("../config/database");

const discrepancyService = {
  /**
   * Xử lý giao dịch bù trừ kho khi Phương án xử lý sai lệch được phê duyệt
   * 1. Cập nhật Tồn Theo Vị Trí (Cộng/Trừ)
   * 2. Ghi nhận Biến động tồn kho (Xử lý sai lệch)
   * 3. Viết Dòng thẻ kho để lưu vết
   * 
   * @param {string} maPhuongAn Mã phương án xử lý
   * @param {string} nguoiThucHien Mã nhân viên (Quản lý) duyệt
   */
  processDiscrepancyResolution: async (maPhuongAn, nguoiThucHien) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();

      // 1. Lấy thông tin Phương án, Hồ sơ, và Chi tiết kiểm kê để biết sai lệch bao nhiêu
      // Phương án chứa mã hồ sơ sai lệch, hồ sơ chứa phiếu kiểm kê
      const reqInfo = new sql.Request(transaction);
      const infoResult = await reqInfo
        .input("maPA", sql.Char(10), maPhuongAn)
        .query(`
          SELECT 
            p.MA_PHUONG_AN, h.MA_HO_SO_XU_LY, h.MA_PHIEU_KIEM_KE,
            c.MA_MAT_HANG, c.MA_LO_HANG, c.SO_LUONG_SAI_LECH, c.MA_DON_VI_TINH
          FROM PhuongAnXuLySaiLech p
          JOIN HoSoXuLySaiLechTonKho h ON p.MA_HO_SO_XU_LY = h.MA_HO_SO_XU_LY
          JOIN ChiTietPhieuKiemKeXacMinh c ON h.MA_PHIEU_KIEM_KE = c.MA_PHIEU_KIEM_KE
          WHERE p.MA_PHUONG_AN = @maPA AND c.SO_LUONG_SAI_LECH <> 0
        `);
      
      const chiTietSaiLech = infoResult.recordset;

      for (const item of chiTietSaiLech) {
        const maMatHang = item.MA_MAT_HANG;
        const maLoHang = item.MA_LO_HANG;
        const saiLech = item.SO_LUONG_SAI_LECH; // > 0: Nhập thừa, < 0: Xuất hao hụt
        const loaiBienDong = saiLech > 0 ? 'Nhập bù do kiểm kê' : 'Xuất hao hụt do kiểm kê';
        
        // Lấy vị trí mặc định của mặt hàng hoặc vị trí ngẫu nhiên đang có tồn (Giả lập do thiếu context vị trí cụ thể từ phiếu kiểm kê)
        const reqVitri = new sql.Request(transaction);
        const vitriResult = await reqVitri
          .input("mh", sql.Char(10), maMatHang)
          .query(`SELECT TOP 1 MA_TON_VI_TRI, MA_VI_TRI FROM TonTheoViTri WHERE MA_MAT_HANG = @mh`);
        
        if (vitriResult.recordset.length === 0) continue; // Không tìm thấy tồn để bù trừ

        const maTonViTri = vitriResult.recordset[0].MA_TON_VI_TRI;
        const maViTri = vitriResult.recordset[0].MA_VI_TRI;

        // 2. Cập nhật TonTheoViTri
        const reqUpdateTon = new sql.Request(transaction);
        await reqUpdateTon
          .input("maTon", sql.Char(10), maTonViTri)
          .input("saiLech", sql.Int, saiLech)
          .query(`UPDATE TonTheoViTri SET SO_LUONG = SO_LUONG + @saiLech, NGAY_CAP_NHAT_GAN_NHAT = SYSDATETIME() WHERE MA_TON_VI_TRI = @maTon`);

        // 3. Ghi Biến động tồn kho
        const maBienDong = "BD_" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const reqBD = new sql.Request(transaction);
        await reqBD
          .input("maBD", sql.Char(10), maBienDong)
          .input("mh", sql.Char(10), maMatHang)
          .input("lo", sql.Char(10), maLoHang || null)
          .input("vitri", sql.Char(10), maViTri)
          .input("ct", sql.Char(10), maPhuongAn)
          .input("loaict", sql.NVarChar(50), 'Phương án xử lý sai lệch')
          .input("loaibd", sql.NVarChar(50), loaiBienDong)
          .input("sl", sql.Int, Math.abs(saiLech))
          .input("nguoi", sql.Char(10), nguoiThucHien)
          .query(`
            INSERT INTO BienDongTonKho (MA_BIEN_DONG, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_CHUNG_TU, LOAI_CHUNG_TU, LOAI_BIEN_DONG, SO_LUONG, THOI_GIAN, NGUOI_THUC_HIEN)
            VALUES (@maBD, @mh, @lo, @vitri, @ct, @loaict, @loaibd, @sl, SYSDATETIME(), @nguoi)
          `);

        // 4. Cập nhật Thẻ Kho (DongTheKho)
        const reqTheKho = new sql.Request(transaction);
        const theKhoRes = await reqTheKho
          .input("mh", sql.Char(10), maMatHang)
          .query(`SELECT MA_THE_KHO FROM TheKho WHERE MA_MAT_HANG = @mh`);
        
        if (theKhoRes.recordset.length > 0) {
          const maTheKho = theKhoRes.recordset[0].MA_THE_KHO;

          // Lấy Tồn cuối
          const reqLastTon = new sql.Request(transaction);
          const lastTonRes = await reqLastTon
            .input("maThe", sql.Char(10), maTheKho)
            .query(`SELECT TOP 1 SO_LUONG_TON FROM DongTheKho WHERE MA_THE_KHO = @maThe ORDER BY NGAY_GHI DESC`);
          
          let tonHienTai = lastTonRes.recordset.length > 0 ? lastTonRes.recordset[0].SO_LUONG_TON : 0;
          const tonSauCung = tonHienTai + saiLech;

          const maDong = "DTK_" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
          const insertDong = new sql.Request(transaction);
          await insertDong
            .input("maDong", sql.Char(10), maDong)
            .input("maThe", sql.Char(10), maTheKho)
            .input("ct", sql.Char(10), maPhuongAn)
            .input("loaict", sql.NVarChar(50), 'Phương án xử lý sai lệch')
            .input("slNhap", sql.Int, saiLech > 0 ? saiLech : 0)
            .input("slXuat", sql.Int, saiLech < 0 ? Math.abs(saiLech) : 0)
            .input("slTon", sql.Int, tonSauCung)
            .input("nguoi", sql.Char(10), nguoiThucHien)
            .query(`
              INSERT INTO DongTheKho (MA_DONG_THE_KHO, MA_THE_KHO, NGAY_GHI, MA_CHUNG_TU, LOAI_CHUNG_TU, SO_LUONG_NHAP, SO_LUONG_XUAT, SO_LUONG_TON, NGUOI_GHI)
              VALUES (@maDong, @maThe, SYSDATETIME(), @ct, @loaict, @slNhap, @slXuat, @slTon, @nguoi)
            `);
        }
      }

      // Cập nhật trạng thái phương án
      const reqUpdatePA = new sql.Request(transaction);
      await reqUpdatePA
        .input("maPA", sql.Char(10), maPhuongAn)
        .input("trangThai", sql.NVarChar(50), 'Đã phê duyệt')
        .query(`UPDATE PhuongAnXuLySaiLech SET TRANG_THAI_PHUONG_AN = @trangThai WHERE MA_PHUONG_AN = @maPA`);

      await transaction.commit();
      return { success: true, message: "Phê duyệt phương án và bù trừ tồn kho thành công" };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

module.exports = discrepancyService;
