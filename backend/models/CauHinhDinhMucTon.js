const sql = require("mssql");
const connectDB = require("../config/database");

const CauHinhDinhMucTon = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT c.*, k.TEN_KHO, m.TEN_MAT_HANG
      FROM CauHinhDinhMucTon c
      LEFT JOIN Kho k ON c.MA_KHO = k.MA_KHO
      LEFT JOIN MatHang m ON c.MA_MAT_HANG = m.MA_MAT_HANG
    `);
    return result.recordset;
  },
  getByMa: async (maCauHinh) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("ma", sql.Char(10), maCauHinh)
      .query("SELECT * FROM CauHinhDinhMucTon WHERE MA_CAU_HINH = @ma");
    return result.recordset[0];
  },
  create: async (data) => {
    const pool = await connectDB();
    return await pool.request()
      .input("ma", sql.Char(10), data.MA_CAU_HINH)
      .input("kho", sql.Char(10), data.MA_KHO)
      .input("mh", sql.Char(10), data.MA_MAT_HANG)
      .input("min", sql.Int, data.MUC_TON_TOI_THIEU)
      .input("max", sql.Int, data.MUC_TON_TOI_DA)
      .input("canhan", sql.Int, data.NGUONG_CAN_HAN)
      .input("trangthai", sql.NVarChar(30), data.TRANG_THAI || 'Hoạt động')
      .query(`
        INSERT INTO CauHinhDinhMucTon (MA_CAU_HINH, MA_KHO, MA_MAT_HANG, MUC_TON_TOI_THIEU, MUC_TON_TOI_DA, NGUONG_CAN_HAN, TRANG_THAI)
        VALUES (@ma, @kho, @mh, @min, @max, @canhan, @trangthai)
      `);
  }
};
module.exports = CauHinhDinhMucTon;
