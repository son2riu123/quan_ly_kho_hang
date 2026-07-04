const sql = require("mssql");
const connectDB = require("../config/database");

const BienBanKiemKe = {
  // Lấy danh sách biên bản (Kèm mảng chi tiết)
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT b.*, 
             (SELECT c.* FROM ChiTietBienBanKiemKe c WHERE c.MA_BIEN_BAN_KIEM_KE = b.MA_BIEN_BAN_KIEM_KE FOR JSON PATH) as chiTiet
      FROM BienBanKiemKe b
    `);
    
    return result.recordset.map(row => ({
      ...row,
      chiTiet: row.chiTiet ? JSON.parse(row.chiTiet) : []
    }));
  },

  // Lấy 1 biên bản theo mã (Kèm mảng chi tiết)
  getByMa: async (maBienBanKiemKe) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maBienBanKiemKe", sql.Char(10), maBienBanKiemKe)
      .query("SELECT * FROM BienBanKiemKe WHERE MA_BIEN_BAN_KIEM_KE = @maBienBanKiemKe");
      
    if (result.recordset.length === 0) return null;
    const bienBan = result.recordset[0];

    const chiTietResult = await pool.request()
      .input("maBienBanKiemKe", sql.Char(10), maBienBanKiemKe)
      .query("SELECT * FROM ChiTietBienBanKiemKe WHERE MA_BIEN_BAN_KIEM_KE = @maBienBanKiemKe");
      
    bienBan.chiTiet = chiTietResult.recordset;
    return bienBan;
  },

  // Tạo mới Biên Bản + Chi Tiết
  create: async (data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      const request = new sql.Request(transaction);

      // 1. Insert bảng chính
      await request
        .input("maBienBanKiemKe", sql.Char(10), data.MA_BIEN_BAN_KIEM_KE)
        .input("maDotKiemKe", sql.Char(10), data.MA_DOT_KIEM_KE)
        .input("ngayLap", sql.DateTime2(0), data.NGAY_LAP)
        .input("nguoiLap", sql.Char(10), data.NGUOI_LAP)
        .input("daiDienQuanLyKho", sql.Char(10), data.DAI_DIEN_QUAN_LY_KHO)
        .input("daiDienThuKho", sql.Char(10), data.DAI_DIEN_THU_KHO)
        .input("daiDienKeToan", sql.Char(10), data.DAI_DIEN_KE_TOAN)
        .input("ketLuan", sql.NVarChar(255), data.KET_LUAN)
        .input("trangThaiBienBan", sql.NVarChar(30), data.TRANG_THAI_BIEN_BAN)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
        .query(`
          INSERT INTO BienBanKiemKe 
          (MA_BIEN_BAN_KIEM_KE, MA_DOT_KIEM_KE, NGAY_LAP, NGUOI_LAP, DAI_DIEN_QUAN_LY_KHO, DAI_DIEN_THU_KHO, DAI_DIEN_KE_TOAN, KET_LUAN, TRANG_THAI_BIEN_BAN, GHI_CHU)
          VALUES 
          (@maBienBanKiemKe, @maDotKiemKe, @ngayLap, @nguoiLap, @daiDienQuanLyKho, @daiDienThuKho, @daiDienKeToan, @ketLuan, @trangThaiBienBan, @ghiChu)
        `);

      // 2. Insert chi tiết
      if (data.chiTiet && data.chiTiet.length > 0) {
        for (const item of data.chiTiet) {
          const detailReq = new sql.Request(transaction);
          await detailReq
            .input("maChiTietBienBan", sql.Char(10), item.MA_CHI_TIET_BIEN_BAN)
            .input("maBienBanKiemKe", sql.Char(10), data.MA_BIEN_BAN_KIEM_KE)
            .input("maChiTietKiemKe", sql.Char(10), item.MA_CHI_TIET_KIEM_KE)
            .input("maMatHang", sql.Char(10), item.MA_MAT_HANG)
            .input("maLoHang", sql.Char(10), item.MA_LO_HANG)
            .input("maViTri", sql.Char(10), item.MA_VI_TRI)
            .input("maDonViTinh", sql.Char(10), item.MA_DON_VI_TINH)
            .input("soLuongSoSach", sql.Int, item.SO_LUONG_SO_SACH)
            .input("soLuongThucTe", sql.Int, item.SO_LUONG_THUC_TE)
            .input("soLuongThua", sql.Int, item.SO_LUONG_THUA || 0)
            .input("soLuongThieu", sql.Int, item.SO_LUONG_THIEU || 0)
            .input("tinhTrangHang", sql.NVarChar(100), item.TINH_TRANG_HANG)
            .input("ghiChu", sql.NVarChar(255), item.GHI_CHU)
            .query(`
              INSERT INTO ChiTietBienBanKiemKe 
              (MA_CHI_TIET_BIEN_BAN, MA_BIEN_BAN_KIEM_KE, MA_CHI_TIET_KIEM_KE, MA_MAT_HANG, MA_LO_HANG, MA_VI_TRI, MA_DON_VI_TINH, SO_LUONG_SO_SACH, SO_LUONG_THUC_TE, SO_LUONG_THUA, SO_LUONG_THIEU, TINH_TRANG_HANG, GHI_CHU)
              VALUES 
              (@maChiTietBienBan, @maBienBanKiemKe, @maChiTietKiemKe, @maMatHang, @maLoHang, @maViTri, @maDonViTinh, @soLuongSoSach, @soLuongThucTe, @soLuongThua, @soLuongThieu, @tinhTrangHang, @ghiChu)
            `);
        }
      }

      await transaction.commit();
      return { message: "Thêm biên bản và chi tiết thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  // Xóa Biên Bản (Xóa chi tiết trước)
  delete: async (maBienBanKiemKe) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      
      const reqDetail = new sql.Request(transaction);
      await reqDetail.input("maBienBanKiemKe", sql.Char(10), maBienBanKiemKe)
                     .query("DELETE FROM ChiTietBienBanKiemKe WHERE MA_BIEN_BAN_KIEM_KE = @maBienBanKiemKe");

      const reqMaster = new sql.Request(transaction);
      await reqMaster.input("maBienBanKiemKe", sql.Char(10), maBienBanKiemKe)
                     .query("DELETE FROM BienBanKiemKe WHERE MA_BIEN_BAN_KIEM_KE = @maBienBanKiemKe");

      await transaction.commit();
      return { message: "Xóa biên bản kiểm kê thành công" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = BienBanKiemKe;