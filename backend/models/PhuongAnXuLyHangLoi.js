const sql = require("mssql");
const connectDB = require("../config/database");

const PhuongAnXuLyHangLoi = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM PhuongAnXuLyHangLoi");
    return result.recordset;
  },

  getByMa: async (maPhuongAn) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maPhuongAn", sql.Char(10), maPhuongAn.trim())
      .query("SELECT * FROM PhuongAnXuLyHangLoi WHERE MA_PHUONG_AN = @maPhuongAn");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maPhuongAn", sql.Char(10), data.MA_PHUONG_AN.trim())
      .input("maPhieuBaoCao", sql.Char(10), data.MA_PHIEU_BAO_CAO.trim())
      .input("loaiPhuongAn", sql.NVarChar(100), data.LOAI_PHUONG_AN)
      .input("lyDo", sql.NVarChar(255), data.LY_DO)
      .input("nguoiChon", sql.Char(10), data.NGUOI_CHON_PHUONG_AN.trim())
      .input("thoiDiemChon", sql.DateTime2, data.THOI_DIEM_CHON)
      .input("canDuyet", sql.Bit, data.CAN_DUYET_CAP_CAO)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_PHUONG_AN)
      .query(`
        INSERT INTO PhuongAnXuLyHangLoi (MA_PHUONG_AN, MA_PHIEU_BAO_CAO, LOAI_PHUONG_AN, LY_DO, NGUOI_CHON_PHUONG_AN, THOI_DIEM_CHON, CAN_DUYET_CAP_CAO, TRANG_THAI_PHUONG_AN)
        VALUES (@maPhuongAn, @maPhieuBaoCao, @loaiPhuongAn, @lyDo, @nguoiChon, @thoiDiemChon, @canDuyet, @trangThai)
      `);
    return { message: "Thêm phương án xử lý thành công" };
  },

  update: async (maPhuongAn, data) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maPhuongAn", sql.Char(10), maPhuongAn.trim())
      .input("maPhieuBaoCao", sql.Char(10), data.MA_PHIEU_BAO_CAO.trim())
      .input("loaiPhuongAn", sql.NVarChar(100), data.LOAI_PHUONG_AN)
      .input("lyDo", sql.NVarChar(255), data.LY_DO)
      .input("nguoiChon", sql.Char(10), data.NGUOI_CHON_PHUONG_AN.trim())
      .input("thoiDiemChon", sql.DateTime2, data.THOI_DIEM_CHON)
      .input("canDuyet", sql.Bit, data.CAN_DUYET_CAP_CAO)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_PHUONG_AN)
      .query(`
        UPDATE PhuongAnXuLyHangLoi
        SET MA_PHIEU_BAO_CAO = @maPhieuBaoCao, LOAI_PHUONG_AN = @loaiPhuongAn, LY_DO = @lyDo,
            NGUOI_CHON_PHUONG_AN = @nguoiChon, THOI_DIEM_CHON = @thoiDiemChon, 
            CAN_DUYET_CAP_CAO = @canDuyet, TRANG_THAI_PHUONG_AN = @trangThai
        WHERE MA_PHUONG_AN = @maPhuongAn
      `);
    return { affectedRows: result.rowsAffected[0], message: "Cập nhật phương án thành công" };
  },

  delete: async (maPhuongAn) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maPhuongAn", sql.Char(10), maPhuongAn.trim())
      .query("DELETE FROM PhuongAnXuLyHangLoi WHERE MA_PHUONG_AN = @maPhuongAn");
    return { affectedRows: result.rowsAffected[0], message: "Xóa phương án thành công" };
  }
};

module.exports = PhuongAnXuLyHangLoi;