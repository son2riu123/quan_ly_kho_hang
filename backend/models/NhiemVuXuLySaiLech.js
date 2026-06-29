const sql = require("mssql");
const connectDB = require("../config/database");

const NhiemVuXuLySaiLech = {
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT n.*, nv.HO_TEN AS TEN_NGUOI_DUOC_PHAN_CONG
      FROM NhiemVuXuLySaiLech n
      LEFT JOIN NhanVien nv ON n.NGUOI_DUOC_PHAN_CONG = nv.MA_NHAN_VIEN
    `);
    return result.recordset;
  },

  getByMa: async (maNhiemVu) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maNhiemVu", sql.Char(10), maNhiemVu)
      .query("SELECT * FROM NhiemVuXuLySaiLech WHERE MA_NHIEM_VU = @maNhiemVu");
    return result.recordset[0];
  },

  getByHoSo: async (maHoSo) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maHoSo", sql.Char(10), maHoSo)
      .query(`
        SELECT n.*, nv.HO_TEN AS TEN_NGUOI_DUOC_PHAN_CONG
        FROM NhiemVuXuLySaiLech n
        LEFT JOIN NhanVien nv ON n.NGUOI_DUOC_PHAN_CONG = nv.MA_NHAN_VIEN
        WHERE n.MA_HO_SO = @maHoSo
      `);
    return result.recordset;
  },

  create: async (data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhiemVu", sql.Char(10), data.MA_NHIEM_VU)
      .input("maHoSo", sql.Char(10), data.MA_HO_SO)
      .input("nguoiDuocPhanCong", sql.Char(10), data.NGUOI_DUOC_PHAN_CONG)
      .input("noiDungNhiemVu", sql.NVarChar(255), data.NOI_DUNG_NHIEM_VU)
      .input("thoiHan", sql.DateTime2, data.THOI_HAN)
      .input("trangThaiNhiemVu", sql.NVarChar(30), data.TRANG_THAI_NHIEM_VU)
      .input("ketQuaThucHien", sql.NVarChar(255), data.KET_QUA_THUC_HIEN)
      .query(`
        INSERT INTO NhiemVuXuLySaiLech
          (MA_NHIEM_VU, MA_HO_SO, NGUOI_DUOC_PHAN_CONG, NOI_DUNG_NHIEM_VU,
           THOI_HAN, TRANG_THAI_NHIEM_VU, KET_QUA_THUC_HIEN)
        VALUES
          (@maNhiemVu, @maHoSo, @nguoiDuocPhanCong, @noiDungNhiemVu,
           @thoiHan, @trangThaiNhiemVu, @ketQuaThucHien)
      `);
    return { message: "Thêm nhiệm vụ xử lý sai lệch thành công" };
  },

  update: async (maNhiemVu, data) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhiemVu", sql.Char(10), maNhiemVu)
      .input("trangThaiNhiemVu", sql.NVarChar(30), data.TRANG_THAI_NHIEM_VU)
      .input("ketQuaThucHien", sql.NVarChar(255), data.KET_QUA_THUC_HIEN)
      .query(`
        UPDATE NhiemVuXuLySaiLech
        SET TRANG_THAI_NHIEM_VU = @trangThaiNhiemVu, KET_QUA_THUC_HIEN = @ketQuaThucHien
        WHERE MA_NHIEM_VU = @maNhiemVu
      `);
    return { message: "Cập nhật nhiệm vụ xử lý sai lệch thành công" };
  },

  delete: async (maNhiemVu) => {
    const pool = await connectDB();
    await pool.request()
      .input("maNhiemVu", sql.Char(10), maNhiemVu)
      .query("DELETE FROM NhiemVuXuLySaiLech WHERE MA_NHIEM_VU = @maNhiemVu");
    return { message: "Xóa nhiệm vụ xử lý sai lệch thành công" };
  }
};

module.exports = NhiemVuXuLySaiLech;