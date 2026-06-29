const sql = require("mssql");
const connectDB = require("../config/database");

const NhiemVuXacMinhCanhBao = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT n.*, c.LOAI_CANH_BAO, c.MA_MAT_HANG, c.MA_KHO, c.SO_LUONG_HIEN_TAI, nv.HO_TEN,
             k.SO_LUONG_THUC_TE, k.MA_VI_TRI_THUC_TE, k.MA_LO_HANG_THUC_TE, k.TINH_TRANG_HANG, k.GHI_CHU AS GHICHU_XAC_MINH
      FROM NhiemVuXacMinhCanhBao n
      LEFT JOIN CanhBaoTonKho c ON n.MA_CANH_BAO = c.MA_CANH_BAO
      LEFT JOIN NhanVien nv ON n.NGUOI_DUOC_PHAN_CONG = nv.MA_NHAN_VIEN
      LEFT JOIN KetQuaXacMinhCanhBao k ON n.MA_NHIEM_VU = k.MA_NHIEM_VU
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
  },
  submitResult: async (data) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);
    try {
      await transaction.begin();

      const requestKQ = new sql.Request(transaction);
      const maKQ = 'KQ' + Math.floor(10000000 + Math.random() * 90000000);
      await requestKQ
        .input("maKQ", sql.Char(10), maKQ)
        .input("maNV", sql.Char(10), data.MA_NHIEM_VU)
        .input("maCB", sql.Char(10), data.MA_CANH_BAO)
        .input("slThucTe", sql.Int, data.SO_LUONG_THUC_TE || 0)
        .input("vtThucTe", sql.Char(10), data.MA_VI_TRI_THUC_TE || null)
        .input("loThucTe", sql.Char(10), data.MA_LO_HANG_THUC_TE || null)
        .input("tinhTrang", sql.NVarChar(100), data.TINH_TRANG_HANG || null)
        .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
        .input("thoiDiem", sql.DateTime2(0), new Date())
        .input("nguoiCapNhat", sql.Char(10), data.NGUOI_CAP_NHAT)
        .query(`
          INSERT INTO KetQuaXacMinhCanhBao (MA_KET_QUA, MA_NHIEM_VU, MA_CANH_BAO, SO_LUONG_THUC_TE, MA_VI_TRI_THUC_TE, MA_LO_HANG_THUC_TE, TINH_TRANG_HANG, GHI_CHU, THOI_DIEM_CAP_NHAT, NGUOI_CAP_NHAT)
          VALUES (@maKQ, @maNV, @maCB, @slThucTe, @vtThucTe, @loThucTe, @tinhTrang, @ghiChu, @thoiDiem, @nguoiCapNhat)
        `);

      const requestNV = new sql.Request(transaction);
      const tomTat = `Đã xác minh: SL thực tế = ${data.SO_LUONG_THUC_TE || 0}, Tình trạng: ${data.TINH_TRANG_HANG || 'Bình thường'}`;
      await requestNV
        .input("maNV", sql.Char(10), data.MA_NHIEM_VU)
        .input("tomTat", sql.NVarChar(255), tomTat)
        .query(`
          UPDATE NhiemVuXacMinhCanhBao
          SET TRANG_THAI_NHIEM_VU = N'Hoàn thành', KET_QUA_TOM_TAT = @tomTat
          WHERE MA_NHIEM_VU = @maNV
        `);

      const requestCB = new sql.Request(transaction);
      await requestCB
        .input("maCB", sql.Char(10), data.MA_CANH_BAO)
        .query(`
          UPDATE CanhBaoTonKho
          SET TRANG_THAI_CANH_BAO = N'Đã xác minh'
          WHERE MA_CANH_BAO = @maCB
        `);

      await transaction.commit();
      return { success: true, maKetQua: maKQ };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
module.exports = NhiemVuXacMinhCanhBao;
