// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const TaiKhoanModel = require("../models/TaiKhoanModel");

// const AuthService = {
//   register: async ({ tenDangNhap, matKhau, maNhanVien }) => {
//     // 1. Gọi Model để kiểm tra tài khoản
//     const isExisting = await TaiKhoanModel.checkExisting(tenDangNhap, maNhanVien);
//     if (isExisting) {
//       throw { statusCode: 409, message: "Tên đăng nhập hoặc Nhân viên này đã có tài khoản." };
//     }

//     // 2. Băm mật khẩu
//     const salt = await bcrypt.genSalt(10);
//     const matKhauHash = await bcrypt.hash(matKhau, salt);

//     // 3. Tạo mã tài khoản
//     const maTaiKhoan = 'TK' + Math.floor(10000000 + Math.random() * 90000000);

//     // 4. Gọi Model để lưu vào CSDL
//     await TaiKhoanModel.create({
//       maTaiKhoan,
//       maNhanVien,
//       tenDangNhap,
//       matKhauHash,
//       trangThai: 'Hoạt động'
//     });

//     return { message: "Tạo tài khoản thành công!" };
//   },

//   login: async ({ tenDangNhap, matKhau }) => {
//     // 1. Gọi Model để tìm user
//     const user = await TaiKhoanModel.findByTenDangNhap(tenDangNhap);

//     if (!user) {
//       throw { statusCode: 401, message: "Tên đăng nhập hoặc mật khẩu không đúng." };
//     }

//     // 2. So sánh mật khẩu
//     const isMatch = await bcrypt.compare(matKhau, user.MAT_KHAU_HASH);
//     if (!isMatch) {
//       throw { statusCode: 401, message: "Tên đăng nhập hoặc mật khẩu không đúng." };
//     }

//     // 3. Tạo Token
//     const payload = {
//       id: user.MA_TAI_KHOAN,
//       maNhanVien: user.MA_NHAN_VIEN,
//       hoTen: user.HO_TEN,
//       chucVu: user.CHUC_VU
//     };

//     const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key_tam_thoi', { expiresIn: '8h' });

//     return { token, user: payload };
//   }
// };

// module.exports = AuthService;