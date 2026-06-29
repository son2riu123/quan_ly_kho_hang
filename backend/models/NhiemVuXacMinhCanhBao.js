const sql = require("mssql");
const connectDB = require("../config/database");

const NhiemVuXacMinhCanhBao = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT n.*, c.LOAI_CANH_BAO, nv.HO_TEN
      FROM NhiemVuXacMinhCanhBao n
      LEFT JOIN CanhBaoTonKho c ON n.MA_CANH_BAO = c.MA_CANH_BAO
      LEFT JOIN NhanVien nv ON n.NGUOI_DUOC_PHAN_CONG = nv.MA_NHAN_VIEN
    `);
    return result.recordset;
  },
  getByMa: async (ma) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("ma", sql.Char(10), ma)
      .query("SELECT * FROM NhiemVuXacMinhCanhBao WHERE MA_NHIEM_VU = @ma");
    
    const header = result.recordset[0];
    if(header) {
      const kq = await pool.request()
        .input("ma", sql.Char(10), ma)
        .query("SELECT * FROM KetQuaXacMinhCanhBao WHERE MA_NHIEM_VU = @ma");
      header.ketQua = kq.recordset;
    }
    return header;
  },
  create: async (data) => {
    const pool = await connectDB();
    return await pool.request()
      .input("ma", sql.Char(10), data.MA_NHIEM_VU)
      .input("cb", sql.Char(10), data.MA_CANH_BAO)
      .input("nguoi", sql.Char(10), data.NGUOI_DUOC_PHAN_CONG)
      .input("nd", sql.NVarChar(255), data.NOI_DUNG_YEU_CAU)
      .input("thoihan", sql.DateTime2(0), data.THOI_HAN || null)
      .input("trangthai", sql.NVarChar(50), data.TRANG_THAI_NHIEM_VU || 'Chờ xử lý')
      .query(`
        INSERT INTO NhiemVuXacMinhCanhBao (MA_NHIEM_VU, MA_CANH_BAO, NGUOI_DUOC_PHAN_CONG, NOI_DUNG_YEU_CAU, THOI_HAN, TRANG_THAI_NHIEM_VU)
        VALUES (@ma, @cb, @nguoi, @nd, @thoihan, @trangthai)
      `);
  }
};
module.exports = NhiemVuXacMinhCanhBao;
