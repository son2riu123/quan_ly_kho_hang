const sql = require("mssql");
const connectDB = require("../config/database");

const PhieuTraNhaCungCap = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM PhieuTraNhaCungCap");
    return result.recordset;
  },

  getByMa: async (maPhieuTra) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maPhieuTra", sql.Char(10), maPhieuTra)
      .query("SELECT * FROM PhieuTraNhaCungCap WHERE MA_PHIEU_TRA = @maPhieuTra");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maPhieuTra", sql.Char(10), data.MA_PHIEU_TRA)
      .input("maLenhXuLy", sql.Char(10), data.MA_LENH_XU_LY)
      .input("maNhaCungCap", sql.Char(10), data.MA_NHA_CUNG_CAP)
      .input("ngayLap", sql.DateTime2(0), data.NGAY_LAP)
      .input("nguoiLap", sql.Char(10), data.NGUOI_LAP)
      .input("lyDoTra", sql.NVarChar(255), data.LY_DO_TRA)
      .input("soLuongTra", sql.Int, data.SO_LUONG_TRA)
      .input("trangThaiTra", sql.NVarChar(30), data.TRANG_THAI_TRA)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
      .query(`
        INSERT INTO PhieuTraNhaCungCap 
        (MA_PHIEU_TRA, MA_LENH_XU_LY, MA_NHA_CUNG_CAP, NGAY_LAP, NGUOI_LAP, LY_DO_TRA, SO_LUONG_TRA, TRANG_THAI_TRA, GHI_CHU)
        VALUES 
        (@maPhieuTra, @maLenhXuLy, @maNhaCungCap, @ngayLap, @nguoiLap, @lyDoTra, @soLuongTra, @trangThaiTra, @ghiChu)
      `);
    return { message: "Thêm phiếu trả nhà cung cấp thành công" };
  },

  update: async (maPhieuTra, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maPhieuTra", sql.Char(10), maPhieuTra)
      .input("maLenhXuLy", sql.Char(10), data.MA_LENH_XU_LY)
      .input("maNhaCungCap", sql.Char(10), data.MA_NHA_CUNG_CAP)
      .input("ngayLap", sql.DateTime2(0), data.NGAY_LAP)
      .input("nguoiLap", sql.Char(10), data.NGUOI_LAP)
      .input("lyDoTra", sql.NVarChar(255), data.LY_DO_TRA)
      .input("soLuongTra", sql.Int, data.SO_LUONG_TRA)
      .input("trangThaiTra", sql.NVarChar(30), data.TRANG_THAI_TRA)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU)
      .query(`
        UPDATE PhieuTraNhaCungCap 
        SET MA_LENH_XU_LY = @maLenhXuLy, MA_NHA_CUNG_CAP = @maNhaCungCap, NGAY_LAP = @ngayLap, 
            NGUOI_LAP = @nguoiLap, LY_DO_TRA = @lyDoTra, SO_LUONG_TRA = @soLuongTra, 
            TRANG_THAI_TRA = @trangThaiTra, GHI_CHU = @ghiChu
        WHERE MA_PHIEU_TRA = @maPhieuTra
      `);
    return { message: "Cập nhật phiếu trả thành công" };
  },

  delete: async (maPhieuTra) => {
    const pool = await connectDB();
    await pool.request()
      .input("maPhieuTra", sql.Char(10), maPhieuTra)
      .query("DELETE FROM PhieuTraNhaCungCap WHERE MA_PHIEU_TRA = @maPhieuTra");
    return { message: "Xóa phiếu trả thành công" };
  }
};

module.exports = PhieuTraNhaCungCap;