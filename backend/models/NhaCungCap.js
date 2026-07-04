const sql = require("mssql");
const connectDB = require("../config/database");

const NhaCungCap = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM NhaCungCap");
    return result.recordset;
  },

  getByMa: async (maNhaCungCap) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maNhaCungCap", sql.Char(10), maNhaCungCap)
      .query("SELECT * FROM NhaCungCap WHERE MA_NHA_CUNG_CAP = @maNhaCungCap");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhaCungCap", sql.Char(10), data.MA_NHA_CUNG_CAP)
      .input("tenNhaCungCap", sql.NVarChar(150), data.TEN_NHA_CUNG_CAP)
      .input("diaChi", sql.NVarChar(255), data.DIA_CHI)
      .input("soDienThoai", sql.VarChar(15), data.SO_DIEN_THOAI)
      .input("email", sql.VarChar(100), data.EMAIL)
      .input("maSoThue", sql.VarChar(30), data.MA_SO_THUE)
      .input("nguoiDaiDien", sql.NVarChar(100), data.NGUOI_DAI_DIEN)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
      .query(`
        INSERT INTO NhaCungCap (MA_NHA_CUNG_CAP, TEN_NHA_CUNG_CAP, DIA_CHI, SO_DIEN_THOAI, EMAIL, MA_SO_THUE, NGUOI_DAI_DIEN, TRANG_THAI)
        VALUES (@maNhaCungCap, @tenNhaCungCap, @diaChi, @soDienThoai, @email, @maSoThue, @nguoiDaiDien, @trangThai)
      `);
    return { message: "Thêm nhà cung cấp thành công" };
  },

  update: async (maNhaCungCap, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhaCungCap", sql.Char(10), maNhaCungCap)
      .input("tenNhaCungCap", sql.NVarChar(150), data.TEN_NHA_CUNG_CAP)
      .input("diaChi", sql.NVarChar(255), data.DIA_CHI)
      .input("soDienThoai", sql.VarChar(15), data.SO_DIEN_THOAI)
      .input("email", sql.VarChar(100), data.EMAIL)
      .input("maSoThue", sql.VarChar(30), data.MA_SO_THUE)
      .input("nguoiDaiDien", sql.NVarChar(100), data.NGUOI_DAI_DIEN)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
      .query(`
        UPDATE NhaCungCap 
        SET TEN_NHA_CUNG_CAP = @tenNhaCungCap, DIA_CHI = @diaChi, SO_DIEN_THOAI = @soDienThoai, 
            EMAIL = @email, MA_SO_THUE = @maSoThue, NGUOI_DAI_DIEN = @nguoiDaiDien, TRANG_THAI = @trangThai
        WHERE MA_NHA_CUNG_CAP = @maNhaCungCap
      `);
    return { message: "Cập nhật nhà cung cấp thành công" };
  },

  delete: async (maNhaCungCap) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhaCungCap", sql.Char(10), maNhaCungCap)
      .query("DELETE FROM NhaCungCap WHERE MA_NHA_CUNG_CAP = @maNhaCungCap");
    return { message: "Xóa nhà cung cấp thành công" };
  }
};

module.exports = NhaCungCap;
