const sql = require("mssql");
const connectDB = require("../config/database");

const YeuCauMuaBoSung = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT y.*, k.TEN_KHO, m.TEN_MAT_HANG
      FROM YeuCauMuaBoSung y
      LEFT JOIN Kho k ON y.MA_KHO = k.MA_KHO
      LEFT JOIN MatHang m ON y.MA_MAT_HANG = m.MA_MAT_HANG
      ORDER BY y.THOI_DIEM_TAO DESC
    `);
    return result.recordset;
  },
  create: async (data) => {
    const pool = await connectDB();
    return await pool.request()
      .input("ma", sql.Char(10), data.MA_YEU_CAU_MUA)
      .input("cb", sql.Char(10), data.MA_CANH_BAO)
      .input("mh", sql.Char(10), data.MA_MAT_HANG)
      .input("kho", sql.Char(10), data.MA_KHO)
      .input("sl", sql.Int, data.SO_LUONG_DE_XUAT)
      .input("lydo", sql.NVarChar(255), data.LY_DO)
      .input("trangthai", sql.NVarChar(50), data.TRANG_THAI_YEU_CAU || 'Chờ duyệt')
      .input("nguoitao", sql.Char(10), data.NGUOI_TAO)
      .input("thoidiem", sql.DateTime2(0), new Date())
      .query(`
        INSERT INTO YeuCauMuaBoSung (MA_YEU_CAU_MUA, MA_CANH_BAO, MA_MAT_HANG, MA_KHO, SO_LUONG_DE_XUAT, LY_DO, TRANG_THAI_YEU_CAU, NGUOI_TAO, THOI_DIEM_TAO)
        VALUES (@ma, @cb, @mh, @kho, @sl, @lydo, @trangthai, @nguoitao, @thoidiem)
      `);
  },
  updateStatus: async (maYeuCau, trangThai) => {
    const pool = await connectDB();
    return await pool.request()
      .input("ma", sql.Char(10), maYeuCau)
      .input("trangThai", sql.NVarChar(50), trangThai)
      .query(`
        UPDATE YeuCauMuaBoSung
        SET TRANG_THAI_YEU_CAU = @trangThai
        WHERE MA_YEU_CAU_MUA = @ma
      `);
  }
};
module.exports = YeuCauMuaBoSung;
