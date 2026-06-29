const sql = require("mssql");
const connectDB = require("../config/database");

const TaiKhoan = {
  // Lấy tất cả tài khoản
  getAll: async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT t.*, n.HO_TEN, n.CHUC_VU 
      FROM TaiKhoan t
      LEFT JOIN NhanVien n ON t.MA_NHAN_VIEN = n.MA_NHAN_VIEN
    `);
    return result.recordset;
  },

  // Tìm theo tên đăng nhập
  getByUsername: async (username) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("username", sql.VarChar(50), username)
      .query(`
        SELECT t.*, n.HO_TEN, n.CHUC_VU 
        FROM TaiKhoan t
        LEFT JOIN NhanVien n ON t.MA_NHAN_VIEN = n.MA_NHAN_VIEN
        WHERE t.TEN_DANG_NHAP = @username
      `);
    return result.recordset[0];
  },

  // Tìm theo mã nhân viên
  getByMaNhanVien: async (maNhanVien) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maNhanVien", sql.Char(10), maNhanVien)
      .query("SELECT * FROM TaiKhoan WHERE MA_NHAN_VIEN = @maNhanVien");
    return result.recordset[0];
  },

  // Tạo tài khoản mới
  create: async (data) => {
    const pool = await connectDB();
    const result = await pool.request()
      .input("maTaiKhoan", sql.Char(10), data.MA_TAI_KHOAN)
      .input("maNhanVien", sql.Char(10), data.MA_NHAN_VIEN)
      .input("tenDangNhap", sql.VarChar(50), data.TEN_DANG_NHAP)
      .input("matKhauHash", sql.VarChar(255), data.MAT_KHAU_HASH)
      .input("trangThai", sql.NVarChar(30), data.TRANG_THAI_TAI_KHOAN || 'Hoạt động')
      .input("ghiChu", sql.NVarChar(255), data.GHI_CHU || null)
      .query(`
        INSERT INTO TaiKhoan (MA_TAI_KHOAN, MA_NHAN_VIEN, TEN_DANG_NHAP, MAT_KHAU_HASH, TRANG_THAI_TAI_KHOAN, GHI_CHU)
        VALUES (@maTaiKhoan, @maNhanVien, @tenDangNhap, @matKhauHash, @trangThai, @ghiChu)
      `);
    return result;
  },

  // Cập nhật lần đăng nhập cuối
  updateLastLogin: async (maTaiKhoan) => {
    const pool = await connectDB();
    await pool.request()
      .input("maTaiKhoan", sql.Char(10), maTaiKhoan)
      .query("UPDATE TaiKhoan SET LAN_DANG_NHAP_CUOI = SYSDATETIME(), SO_LAN_DANG_NHAP_SAI = 0 WHERE MA_TAI_KHOAN = @maTaiKhoan");
  },

  // Tăng số lần đăng nhập sai
  incrementFailedLogin: async (maTaiKhoan) => {
    const pool = await connectDB();
    await pool.request()
      .input("maTaiKhoan", sql.Char(10), maTaiKhoan)
      .query("UPDATE TaiKhoan SET SO_LAN_DANG_NHAP_SAI = SO_LAN_DANG_NHAP_SAI + 1 WHERE MA_TAI_KHOAN = @maTaiKhoan");
  },

  // Khóa tài khoản
  lockAccount: async (maTaiKhoan) => {
    const pool = await connectDB();
    await pool.request()
      .input("maTaiKhoan", sql.Char(10), maTaiKhoan)
      .query("UPDATE TaiKhoan SET TRANG_THAI_TAI_KHOAN = N'Khóa' WHERE MA_TAI_KHOAN = @maTaiKhoan");
  },

  // Đặt lại mật khẩu mới
  resetPassword: async (maTaiKhoan, matKhauHash) => {
    const pool = await connectDB();
    await pool.request()
      .input("maTaiKhoan", sql.VarChar(10), maTaiKhoan)
      .input("matKhauHash", sql.VarChar(255), matKhauHash)
      .query("UPDATE TaiKhoan SET MAT_KHAU_HASH = @matKhauHash, SO_LAN_DANG_NHAP_SAI = 0, TRANG_THAI_TAI_KHOAN = N'Hoạt động' WHERE MA_TAI_KHOAN = @maTaiKhoan");
  }
};

module.exports = TaiKhoan;
