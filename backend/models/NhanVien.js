const sql = require("mssql");
const connectDB = require("../config/database");

const NhanVien = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM NhanVien");
    return result.recordset;
  },

  getByMa: async (maNhanVien) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maNhanVien", sql.Char(10), maNhanVien)
      .query("SELECT * FROM NhanVien WHERE MA_NHAN_VIEN = @maNhanVien");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhanVien", sql.Char(10), data.MA_NHAN_VIEN)
      .input("hoTen", sql.NVarChar(100), data.HO_TEN)
      .input("chucVu", sql.NVarChar(50), data.CHUC_VU)
      .input("soDienThoai", sql.VarChar(15), data.SO_DIEN_THOAI)
      .input("email", sql.VarChar(100), data.EMAIL)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
      .query(`
        INSERT INTO NhanVien (MA_NHAN_VIEN, HO_TEN, CHUC_VU, SO_DIEN_THOAI, EMAIL, TRANG_THAI)
        VALUES (@maNhanVien, @hoTen, @chucVu, @soDienThoai, @email, @trangThai)
      `);
    return { message: "Thêm nhân viên thành công" };
  },

  update: async (maNhanVien, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhanVien", sql.Char(10), maNhanVien)
      .input("hoTen", sql.NVarChar(100), data.HO_TEN)
      .input("chucVu", sql.NVarChar(50), data.CHUC_VU)
      .input("soDienThoai", sql.VarChar(15), data.SO_DIEN_THOAI)
      .input("email", sql.VarChar(100), data.EMAIL)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI)
      .query(`
        UPDATE NhanVien 
        SET HO_TEN = @hoTen, CHUC_VU = @chucVu, SO_DIEN_THOAI = @soDienThoai, 
            EMAIL = @email, TRANG_THAI = @trangThai
        WHERE MA_NHAN_VIEN = @maNhanVien
      `);
    return { message: "Cập nhật nhân viên thành công" };
  },

  delete: async (maNhanVien) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhanVien", sql.Char(10), maNhanVien)
      .query("DELETE FROM NhanVien WHERE MA_NHAN_VIEN = @maNhanVien");
    return { message: "Xóa nhân viên thành công" };
  }
};

module.exports = NhanVien;
