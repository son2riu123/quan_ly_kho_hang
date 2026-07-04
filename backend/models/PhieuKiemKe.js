const sql = require("mssql");
const connectDB = require("../config/database");

const PhieuKiemKe = {
  // Lấy danh sách phiếu (Kèm mảng chi tiết)
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT p.*, 
             (SELECT c.* FROM ChiTietKiemKe c WHERE c.MA_PHIEU_KIEM_KE = p.MA_PHIEU_KIEM_KE FOR JSON PATH) as chiTiet
      FROM PhieuKiemKe p
    `);
    
    // Parse JSON string về mảng object
    return result.recordset.map(row => ({
      ...row,
      chiTiet: row.chiTiet ? JSON.parse(row.chiTiet) : []
    }));
  },

  // Lấy 1 phiếu theo mã (Kèm mảng chi tiết)
  getByMa: async (maPhieuKiemKe) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maPhieuKiemKe", sql.Char(10), maPhieuKiemKe)
      .query("SELECT * FROM PhieuKiemKe WHERE MA_PHIEU_KIEM_KE = @maPhieuKiemKe");
      
    if (result.recordset.length === 0) return null;
    const phieu = result.recordset[0];

    const chiTietResult = await pool.request()
      .input("maPhieuKiemKe", sql.Char(10), maPhieuKiemKe)
      .query("SELECT * FROM ChiTietKiemKe WHERE MA_PHIEU_KIEM_KE = @maPhieuKiemKe");
      
    phieu.chiTiet = chiTietResult.recordset;
    return phieu;
  },

  // Tạo mới Phiếu + Dòng Chi Tiết (Sử dụng Transaction)
  create: async (data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      const request = new sql.Request(transaction);

      // 1. Insert bảng chính
      await request
        .input("maPhieuKiemKe", sql.Char(10), data.MA_PHIEU_KIEM_KE)
        .input("maDotKiemKe", sql.Char(10), data.MA_DOT_KIEM_KE)
        .input("maNhomKiemKe", sql.Char(10), data.MA_NHOM_KIEM_KE)
        .input("nguoiPhuTrach", sql.Char(10), data.NGUOI_PHU_TRACH)
        .input("ngayTao", sql.DateTime2(0), data.NGAY_TAO)
        .input("trangThaiPhieu", sql.NVarChar(30), data.TRANG_THAI_PHIEU)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
        .query(`
          INSERT INTO PhieuKiemKe (MA_PHIEU_KIEM_KE, MA_DOT_KIEM_KE, MA_NHOM_KIEM_KE, NGUOI_PHU_TRACH, NGAY_TAO, TRANG_THAI_PHIEU, GHI_CHU)
          VALUES (@maPhieuKiemKe, @maDotKiemKe, @maNhomKiemKe, @nguoiPhuTrach, @ngayTao, @trangThaiPhieu, @ghiChu)
        `);

      // 2. Insert bảng chi tiết (Lặp qua mảng data.chiTiet)
      if (data.chiTiet && data.chiTiet.length > 0) {
        for (const item of data.chiTiet) {
          const detailReq = new sql.Request(transaction);
          await detailReq
            .input("maChiTietKiemKe", sql.Char(10), item.MA_CHI_TIET_KIEM_KE)
            .input("maPhieuKiemKe", sql.Char(10), data.MA_PHIEU_KIEM_KE)
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG)
            .input("maLoHang", sql.Char(10), item.MA_LO_HANG)
            .input("maViTriHeThong", sql.Char(10), item.MA_VI_TRI_HE_THONG)
            .input("maViTriThucTe", sql.Char(10), item.MA_VI_TRI_THUC_TE)
            .input("trangThaiTonHeThong", sql.NVarChar(50), item.TRANG_THAI_TON_HE_THONG)
            .input("trangThaiTonThucTe", sql.NVarChar(50), item.TRANG_THAI_TON_THUC_TE)
            .input("soLuongSoSach", sql.Int, item.SO_LUONG_SO_SACH)
            .input("soLuongThucTe", sql.Int, item.SO_LUONG_THUC_TE)
            .input("chenhLech", sql.Int, item.CHENH_LECH)
            .input("loaiChenhLech", sql.NVarChar(50), item.LOAI_CHENH_LECH)
            .input("tinhTrangHang", sql.NVarChar(100), item.TINH_TRANG_HANG)
            .input("ghiChu", sql.NVarChar(255), item.GHI_CHU)
            .query(`
              INSERT INTO ChiTietKiemKe 
              (MA_CHI_TIET_KIEM_KE, MA_PHIEU_KIEM_KE, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI_HE_THONG, MA_VI_TRI_THUC_TE, 
              TRANG_THAI_TON_HE_THONG, TRANG_THAI_TON_THUC_TE, SO_LUONG_SO_SACH, SO_LUONG_THUC_TE, CHENH_LECH, LOAI_CHENH_LECH, TINH_TRANG_HANG, GHI_CHU)
              VALUES 
              (@maChiTietKiemKe, @maPhieuKiemKe, @maMatHang, @maLoHang, @maViTriHeThong, @maViTriThucTe, 
              @trangThaiTonHeThong, @trangThaiTonThucTe, @soLuongSoSach, @soLuongThucTe, @chenhLech, @loaiChenhLech, @tinhTrangHang, @ghiChu)
            `);
        }
      }

      await transaction.commit();
      return { message: "Thêm phiếu và chi tiết kiểm kê thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  // Xóa Phiếu (Xóa chi tiết trước, xóa chính sau)
  delete: async (maPhieuKiemKe) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      
      const reqDetail = new sql.Request(transaction);
      await reqDetail.input("maPhieuKiemKe", sql.Char(10), maPhieuKiemKe)
                     .query("DELETE FROM ChiTietKiemKe WHERE MA_PHIEU_KIEM_KE = @maPhieuKiemKe");

      const reqMaster = new sql.Request(transaction);
      await reqMaster.input("maPhieuKiemKe", sql.Char(10), maPhieuKiemKe)
                     .query("DELETE FROM PhieuKiemKe WHERE MA_PHIEU_KIEM_KE = @maPhieuKiemKe");

      await transaction.commit();
      return { message: "Xóa phiếu kiểm kê thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = PhieuKiemKe;