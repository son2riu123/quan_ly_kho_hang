const TaiKhoan = require("../models/TaiKhoan");
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwtUtils");

const TaiKhoanController = {
  // Đăng nhập
  login: async (req, res) => {
    try {
      const { tenDangNhap, matKhau } = req.body;
      if (!tenDangNhap || !matKhau) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu" });
      }

      const taiKhoan = await TaiKhoan.getByUsername(tenDangNhap);
      if (!taiKhoan) {
        return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
      }

      if (taiKhoan.TRANG_THAI_TAI_KHOAN !== 'Hoạt động') {
        return res.status(403).json({ message: `Tài khoản đang bị khóa hoặc vô hiệu hóa (${taiKhoan.TRANG_THAI_TAI_KHOAN})` });
      }

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(matKhau, taiKhoan.MAT_KHAU_HASH);
      
      if (!isMatch) {
        // Tăng số lần đăng nhập sai
        await TaiKhoan.incrementFailedLogin(taiKhoan.MA_TAI_KHOAN);
        // Nếu sai quá 5 lần thì khóa
        if (taiKhoan.SO_LAN_DANG_NHAP_SAI >= 4) { // Lần này là lần thứ 5
          await TaiKhoan.lockAccount(taiKhoan.MA_TAI_KHOAN);
          return res.status(403).json({ message: "Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần" });
        }
        return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
      }

      // Đăng nhập thành công
      await TaiKhoan.updateLastLogin(taiKhoan.MA_TAI_KHOAN);

      // Tạo token thông qua utils
      const payload = {
        maTaiKhoan: taiKhoan.MA_TAI_KHOAN,
        maNhanVien: taiKhoan.MA_NHAN_VIEN,
        chucVu: taiKhoan.CHUC_VU,
        hoTen: taiKhoan.HO_TEN
      };

      const token = jwtUtils.generateToken(payload, "24h");

      res.status(200).json({
        message: "Đăng nhập thành công",
        token,
        user: payload
      });

    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Tạo tài khoản (Thường chỉ dành cho Admin)
  createAccount: async (req, res) => {
    try {
      const { maTaiKhoan, maNhanVien, tenDangNhap, matKhau, ghiChu } = req.body;
      
      // Kiểm tra xem NV đã có TK chưa
      const existByNV = await TaiKhoan.getByMaNhanVien(maNhanVien);
      if (existByNV) return res.status(400).json({ message: "Nhân viên này đã có tài khoản" });

      const existByUsername = await TaiKhoan.getByUsername(tenDangNhap);
      if (existByUsername) return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const matKhauHash = await bcrypt.hash(matKhau, salt);

      await TaiKhoan.create({
        MA_TAI_KHOAN: maTaiKhoan,
        MA_NHAN_VIEN: maNhanVien,
        TEN_DANG_NHAP: tenDangNhap,
        MAT_KHAU_HASH: matKhauHash,
        GHI_CHU: ghiChu
      });

      res.status(201).json({ message: "Tạo tài khoản thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo tài khoản", error: error.message });
    }
  },

  // Lấy danh sách tài khoản
  getAll: async (req, res) => {
    try {
      const result = await TaiKhoan.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Đặt lại mật khẩu cho tài khoản (Thường dành cho Quản lý)
  resetPassword: async (req, res) => {
    try {
      const { maTaiKhoan, matKhau } = req.body;
      if (!maTaiKhoan || !matKhau) {
        return res.status(400).json({ message: "Vui lòng truyền mã tài khoản và mật khẩu mới" });
      }

      // Mã hóa mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const matKhauHash = await bcrypt.hash(matKhau, salt);

      await TaiKhoan.resetPassword(maTaiKhoan, matKhauHash);
      res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi đặt lại mật khẩu", error: error.message });
    }
  }
};

module.exports = TaiKhoanController;
