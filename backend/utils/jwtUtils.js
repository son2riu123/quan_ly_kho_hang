const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "sieubimat_quanlykho_123";

const jwtUtils = {
  /**
   * Tạo JWT Token mới
   * @param {Object} payload Dữ liệu cần mã hóa (VD: id, username, role)
   * @param {string} expiresIn Thời gian hết hạn (Mặc định 24h)
   * @returns {string} Token
   */
  generateToken: (payload, expiresIn = "24h") => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  /**
   * Xác thực và giải mã Token
   * @param {string} token Chuỗi token
   * @returns {Object} Payload đã giải mã (ném lỗi nếu sai/hết hạn)
   */
  verifyToken: (token) => {
    return jwt.verify(token, JWT_SECRET);
  }
};

module.exports = jwtUtils;
