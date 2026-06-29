// const sql = require("mssql");
// const connectDB = require("../config/database");

// const TaiKhoanModel = {
//   /**
//    * Tìm tài khoản bằng tên đăng nhập và JOIN để lấy thông tin nhân viên.
//    * @param {string} tenDangNhap
//    * @returns {Promise<object|null>}
//    */
//   findByTenDangNhap: async (tenDangNhap) => {
//     const pool = await connectDB();
//     const result = await pool.request()
//       .input("tenDangNhap", sql.VarChar, tenDangNhap)
//       .query(`
//         SELECT tk.*, nv.HO_TEN, nv.CHUC_VU
//         FROM TaiKhoan tk
//         JOIN NhanVien nv ON tk.MA_NHAN_VIEN = nv.MA_NHAN_VIEN
//         WHERE tk.TEN_DANG_NHAP = @tenDangNhap
//       `);
//     return result.recordset[0];
//   },

//   /**
//    * Kiểm tra sự tồn tại của tài khoản bằng tên đăng nhập hoặc mã nhân viên.
//    * @param {string} tenDangNhap
//    * @param {string} maNhanVien
//    * @returns {Promise<boolean>}
//    */
//   checkExisting: async (tenDangNhap, maNhanVien) => {
//     const pool = await connectDB();
//     const result = await pool.request()
//       .input("tenDangNhap", sql.VarChar, tenDangNhap)
//       .input("maNhanVien", sql.Char(10), maNhanVien)
//       .query("SELECT MA_TAI_KHOAN FROM TaiKhoan WHERE TEN_DANG_NHAP = @tenDangNhap OR MA_NHAN_VIEN = @maNhanVien");
//     return result.recordset.length > 0;
//   },

//   /**
//    * Tạo một tài khoản mới.
//    * @param {object} taiKhoanData
//    */
//   create: async (taiKhoanData) => {
//     const { maTaiKhoan, maNhanVien, tenDangNhap, matKhauHash, trangThai } = taiKhoanData;
//     const pool = await connectDB();
//     await pool.request()
//       .input("maTaiKhoan", sql.Char(10), maTaiKhoan)
//       .input("maNhanVien", sql.Char(10), maNhanVien)
//       .input("tenDangNhap", sql.VarChar(50), tenDangNhap)
//       .input("matKhauHash", sql.VarChar(255), matKhauHash)
//       .input("trangThai", sql.NVarChar(30), trangThai)
//       .query(`
//         INSERT INTO TaiKhoan (MA_TAI_KHOAN, MA_NHAN_VIEN, TEN_DANG_NHAP, MAT_KHAU_HASH, TRANG_THAI_TAI_KHOAN)
//         VALUES (@maTaiKhoan, @maNhanVien, @tenDangNhap, @matKhauHash, @trangThai)
//       `);
//   }
// };

// module.exports = TaiKhoanModel;
