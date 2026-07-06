const sql = require("mssql");
const connectDB = require("../config/database");

const TonKho = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT ton.*, 
             mh.TEN_MAT_HANG, mh.NHOM_HANG,
             vt.KHU, vt.DAY, vt.KE, vt.TANG, vt.O, vt.MA_KHO,
             k.TEN_KHO,
             lh.HAN_SU_DUNG
      FROM TonTheoViTri ton
      INNER JOIN MatHang mh ON ton.MA_MAT_HANG = mh.MA_MAT_HANG
      INNER JOIN ViTriKho vt ON ton.MA_VI_TRI = vt.MA_VI_TRI
      INNER JOIN Kho k ON vt.MA_KHO = k.MA_KHO
      LEFT JOIN LoHang lh ON ton.MA_LO_HANG = lh.MA_LO_HANG
    `);
    return result.recordset;
  },

  getSummary: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT ton.MA_MAT_HANG, mh.TEN_MAT_HANG, mh.NHOM_HANG, 
             SUM(ton.SO_LUONG) AS TONG_SO_LUONG,
             SUM(CASE WHEN ton.TRANG_THAI_TON = N'Khả dụng' THEN ton.SO_LUONG ELSE 0 END) AS TON_KHA_DUNG,
             COUNT(DISTINCT ton.MA_LO_HANG) AS SO_LU_ONG_LO,
             COUNT(DISTINCT ton.MA_VI_TRI) AS SO_VI_TRI
      FROM TonTheoViTri ton
      INNER JOIN MatHang mh ON ton.MA_MAT_HANG = mh.MA_MAT_HANG
      GROUP BY ton.MA_MAT_HANG, mh.TEN_MAT_HANG, mh.NHOM_HANG
    `);
    return result.recordset;
  }
};

module.exports = TonKho;
