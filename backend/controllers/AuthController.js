// const AuthService = require('../services/AuthService');

// const AuthController = {
//   register: async (req, res) => {
//     const { tenDangNhap, matKhau, maNhanVien } = req.body;

//     if (!tenDangNhap || !matKhau || !maNhanVien) {
//       return res.status(400).json({ success: false, message: "Vui lòng cung cấp đủ Tên đăng nhập, Mật khẩu và Mã nhân viên." });
//     }

//     try {
//       const result = await AuthService.register(req.body);
//       res.status(201).json({ success: true, ...result });
//     } catch (error) {
//       console.error("Lỗi khi đăng ký:", error);
//       res.status(error.statusCode || 500).json({ success: false, message: error.message });
//     }
//   },

//   login: async (req, res) => {
//     const { tenDangNhap, matKhau } = req.body;

//     if (!tenDangNhap || !matKhau) {
//       return res.status(400).json({ success: false, message: "Vui lòng nhập Tên đăng nhập và Mật khẩu." });
//     }

//     try {
//       const result = await AuthService.login(req.body);
//       res.status(200).json({ success: true, message: "Đăng nhập thành công!", ...result });
//     } catch (error) {
//       console.error("Lỗi khi đăng nhập:", error);
//       res.status(error.statusCode || 500).json({ success: false, message: error.message });
//     }
//   }
// };

// module.exports = AuthController;