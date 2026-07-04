const sql = require("mssql");
const connectDB = require("../config/database");

const ThanhVienKiemKe = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM ThanhVienKiemKe");
    return result.recordset;
  },

  getByMa: async (maNhomKiemKe, maNhanVien) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maNhomKiemKe", sql.Char(10), maNhomKiemKe)
      .input("maNhanVien", sql.Char(10), maNhanVien)
      .query("SELECT * FROM ThanhVienKiemKe WHERE MA_NHOM_KIEM_KE = @maNhomKiemKe AND MA_NHAN_VIEN = @maNhanVien");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhomKiemKe", sql.Char(10), data.MA_NHOM_KIEM_KE)
      .input("maNhanVien", sql.Char(10), data.MA_NHAN_VIEN)
      .input("vaiTroTrongNhom", sql.NVarChar(50), data.VAI_TRO_TRONG_NHOM)
      .query(`
        INSERT INTO ThanhVienKiemKe (MA_NHOM_KIEM_KE, MA_NHAN_VIEN, VAI_TRO_TRONG_NHOM)
        VALUES (@maNhomKiemKe, @maNhanVien, @vaiTroTrongNhom)
      `);
    return { message: "Thêm thành viên kiểm kê thành công" };
  },

  update: async (maNhomKiemKe, maNhanVien, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhomKiemKe", sql.Char(10), maNhomKiemKe)
      .input("maNhanVien", sql.Char(10), maNhanVien)
      .input("vaiTroTrongNhom", sql.NVarChar(50), data.VAI_TRO_TRONG_NHOM)
      .query(`
        UPDATE ThanhVienKiemKe 
        SET VAI_TRO_TRONG_NHOM = @vaiTroTrongNhom
        WHERE MA_NHOM_KIEM_KE = @maNhomKiemKe AND MA_NHAN_VIEN = @maNhanVien
      `);
    return { message: "Cập nhật thành viên kiểm kê thành công" };
  },

  delete: async (maNhomKiemKe, maNhanVien) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhomKiemKe", sql.Char(10), maNhomKiemKe)
      .input("maNhanVien", sql.Char(10), maNhanVien)
      .query("DELETE FROM ThanhVienKiemKe WHERE MA_NHOM_KIEM_KE = @maNhomKiemKe AND MA_NHAN_VIEN = @maNhanVien");
    return { message: "Xóa thành viên kiểm kê thành công" };
  }
};

module.exports = ThanhVienKiemKe;