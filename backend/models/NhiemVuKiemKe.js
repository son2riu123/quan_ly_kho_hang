const sql = require("mssql");
const connectDB = require("../config/database");

const NhiemVuKiemKe = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM NhiemVuKiemKe");
    return result.recordset;
  },

  getByMa: async (maNhiemVu) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maNhiemVu", sql.Char(10), maNhiemVu)
      .query("SELECT * FROM NhiemVuKiemKe WHERE MA_NHIEM_VU = @maNhiemVu");
    return result.recordset[0];
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhiemVu", sql.Char(10), data.MA_NHIEM_VU)
      .input("maDotKiemKe", sql.Char(10), data.MA_DOT_KIEM_KE)
      .input("nguoiDuocPhanCong", sql.Char(10), data.NGUOI_DUOC_PHAN_CONG)
      .input("phamViKiemKe", sql.NVarChar(150), data.PHAM_VI_KIEM_KE)
      .input("thoiHan", sql.DateTime2(0), data.THOI_HAN)
      .input("trangThaiNhiemVu", sql.NVarChar(30), data.TRANG_THAI_NHIEM_VU)
      .input("ketQuaThucHien", sql.NVarChar(255), data.KET_QUA_THUC_HIEN)
      .query(`
        INSERT INTO NhiemVuKiemKe 
        (MA_NHIEM_VU, MA_DOT_KIEM_KE, NGUOI_DUOC_PHAN_CONG, PHAM_VI_KIEM_KE, THOI_HAN, TRANG_THAI_NHIEM_VU, KET_QUA_THUC_HIEN)
        VALUES 
        (@maNhiemVu, @maDotKiemKe, @nguoiDuocPhanCong, @phamViKiemKe, @thoiHan, @trangThaiNhiemVu, @ketQuaThucHien)
      `);
    return { message: "Thêm nhiệm vụ kiểm kê thành công" };
  },

  update: async (maNhiemVu, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhiemVu", sql.Char(10), maNhiemVu)
      .input("maDotKiemKe", sql.Char(10), data.MA_DOT_KIEM_KE)
      .input("nguoiDuocPhanCong", sql.Char(10), data.NGUOI_DUOC_PHAN_CONG)
      .input("phamViKiemKe", sql.NVarChar(150), data.PHAM_VI_KIEM_KE)
      .input("thoiHan", sql.DateTime2(0), data.THOI_HAN)
      .input("trangThaiNhiemVu", sql.NVarChar(30), data.TRANG_THAI_NHIEM_VU)
      .input("ketQuaThucHien", sql.NVarChar(255), data.KET_QUA_THUC_HIEN)
      .query(`
        UPDATE NhiemVuKiemKe 
        SET MA_DOT_KIEM_KE = @maDotKiemKe, NGUOI_DUOC_PHAN_CONG = @nguoiDuocPhanCong, 
            PHAM_VI_KIEM_KE = @phamViKiemKe, THOI_HAN = @thoiHan, 
            TRANG_THAI_NHIEM_VU = @trangThaiNhiemVu, KET_QUA_THUC_HIEN = @ketQuaThucHien
        WHERE MA_NHIEM_VU = @maNhiemVu
      `);
    return { message: "Cập nhật nhiệm vụ kiểm kê thành công" };
  },

  delete: async (maNhiemVu) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhiemVu", sql.Char(10), maNhiemVu)
      .query("DELETE FROM NhiemVuKiemKe WHERE MA_NHIEM_VU = @maNhiemVu");
    return { message: "Xóa nhiệm vụ kiểm kê thành công" };
  }
};

module.exports = NhiemVuKiemKe;