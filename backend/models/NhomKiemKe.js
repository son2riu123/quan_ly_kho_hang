const sql = require("mssql");
const connectDB = require("../config/database");

const NhomKiemKe = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM NhomKiemKe");
    return result.recordset;
  },

  getByMa: async (maNhomKiemKe) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maNhomKiemKe", sql.Char(10), maNhomKiemKe)
      .query("SELECT * FROM NhomKiemKe WHERE MA_NHOM_KIEM_KE = @maNhomKiemKe");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhomKiemKe", sql.Char(10), data.MA_NHOM_KIEM_KE)
      .input("tenNhom", sql.NVarChar(100), data.TEN_NHOM)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        INSERT INTO NhomKiemKe (MA_NHOM_KIEM_KE, TEN_NHOM, GHI_CHU)
        VALUES (@maNhomKiemKe, @tenNhom, @ghiChu)
      `);
    return { message: "Thêm nhóm kiểm kê thành công" };
  },

  update: async (maNhomKiemKe, data) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maNhomKiemKe", sql.Char(10), maNhomKiemKe)
      .input("tenNhom", sql.NVarChar(100), data.TEN_NHOM)
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        UPDATE NhomKiemKe
        SET TEN_NHOM = @tenNhom, GHI_CHU = @ghiChu
        WHERE MA_NHOM_KIEM_KE = @maNhomKiemKe
      `);
    return { 
      affectedRows: result.rowsAffected[0], 
      message: "Cập nhật nhóm kiểm kê thành công" 
    };
  },

  delete: async (maNhomKiemKe) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maNhomKiemKe", sql.Char(10), maNhomKiemKe)
      .query("DELETE FROM NhomKiemKe WHERE MA_NHOM_KIEM_KE = @maNhomKiemKe");
    return { 
      affectedRows: result.rowsAffected[0], 
      message: "Xóa nhóm kiểm kê thành công" 
    };
  }
};

module.exports = NhomKiemKe;