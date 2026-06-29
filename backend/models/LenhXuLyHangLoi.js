const sql = require("mssql");
const connectDB = require("../config/database");

const LenhXuLyHangLoi = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM LenhXuLyHangLoi");
    return result.recordset;
  },

  getByMa: async (maLenh) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maLenh", sql.Char(10), maLenh.trim())
      .query("SELECT * FROM LenhXuLyHangLoi WHERE MA_LENH_XU_LY = @maLenh");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maLenh", sql.Char(10), data.MA_LENH_XU_LY.trim())
      .input("maPhuongAn", sql.Char(10), data.MA_PHUONG_AN.trim())
      .input("nguoiPhanCong", sql.Char(10), data.NGUOI_DUOC_PHAN_CONG.trim())
      .input("noiDung", sql.NVarChar(255), data.NOI_DUNG_LENH)
      .input("thoiHan", sql.DateTime2, data.THOI_HAN || null)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_LENH)
      .input("ketQua", sql.NVarChar(255), data.KET_QUA_THUC_HIEN || null)
      .query(`
        INSERT INTO LenhXuLyHangLoi (MA_LENH_XU_LY, MA_PHUONG_AN, NGUOI_DUOC_PHAN_CONG, NOI_DUNG_LENH, THOI_HAN, TRANG_THAI_LENH, KET_QUA_THUC_HIEN)
        VALUES (@maLenh, @maPhuongAn, @nguoiPhanCong, @noiDung, @thoiHan, @trangThai, @ketQua)
      `);
    return { message: "Thêm lệnh xử lý thành công" };
  },

  update: async (maLenh, data) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maLenh", sql.Char(10), maLenh.trim())
      .input("maPhuongAn", sql.Char(10), data.MA_PHUONG_AN.trim())
      .input("nguoiPhanCong", sql.Char(10), data.NGUOI_DUOC_PHAN_CONG.trim())
      .input("noiDung", sql.NVarChar(255), data.NOI_DUNG_LENH)
      .input("thoiHan", sql.DateTime2, data.THOI_HAN || null)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_LENH)
      .input("ketQua", sql.NVarChar(255), data.KET_QUA_THUC_HIEN || null)
      .query(`
        UPDATE LenhXuLyHangLoi
        SET MA_PHUONG_AN = @maPhuongAn, NGUOI_DUOC_PHAN_CONG = @nguoiPhanCong, NOI_DUNG_LENH = @noiDung,
            THOI_HAN = @thoiHan, TRANG_THAI_LENH = @trangThai, KET_QUA_THUC_HIEN = @ketQua
        WHERE MA_LENH_XU_LY = @maLenh
      `);
    return { affectedRows: result.rowsAffected[0], message: "Cập nhật lệnh xử lý thành công" };
  },

  delete: async (maLenh) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maLenh", sql.Char(10), maLenh.trim())
      .query("DELETE FROM LenhXuLyHangLoi WHERE MA_LENH_XU_LY = @maLenh");
    return { affectedRows: result.rowsAffected[0], message: "Xóa lệnh xử lý thành công" };
  }
};

module.exports = LenhXuLyHangLoi;