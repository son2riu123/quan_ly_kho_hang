const sql = require("mssql");
const connectDB = require("../config/database");

const PhuongAnXuLyCanhBao = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM PhuongAnXuLyCanhBao");
    return result.recordset;
  },
  create: async (data) => {
    const pool = await connectDB();
    return await pool.request()
      .input("ma", sql.Char(10), data.MA_PHUONG_AN)
      .input("cb", sql.Char(10), data.MA_CANH_BAO)
      .input("loai", sql.NVarChar(100), data.LOAI_PHUONG_AN)
      .input("nd", sql.NVarChar(255), data.NOI_DUNG_PHUONG_AN)
      .input("nguoi", sql.Char(10), data.NGUOI_CHON)
      .input("thoidiem", sql.DateTime2(0), new Date())
      .input("trangthai", sql.NVarChar(50), data.TRANG_THAI_PHUONG_AN || 'Đã chọn')
      .input("ghichu", sql.NVarChar(255), data.GHI_CHU)
      .query(`
        INSERT INTO PhuongAnXuLyCanhBao (MA_PHUONG_AN, MA_CANH_BAO, LOAI_PHUONG_AN, NOI_DUNG_PHUONG_AN, NGUOI_CHON, THOI_DIEM_CHON, TRANG_THAI_PHUONG_AN, GHI_CHU)
        VALUES (@ma, @cb, @loai, @nd, @nguoi, @thoidiem, @trangthai, @ghichu)
      `);
  }
};
module.exports = PhuongAnXuLyCanhBao;
