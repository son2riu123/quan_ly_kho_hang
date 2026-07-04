/**
 * Middleware kiểm tra quyền truy cập dựa trên CHUC_VU của nhân viên
 * @param {Array<string>} allowedRoles - Mảng chứa các chức vụ được phép truy cập
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // req.user được tạo ra từ authMiddleware
    if (!req.user || !req.user.chucVu) {
      return res.status(403).json({ message: "Không thể xác định quyền hạn của tài khoản!" });
    }

    const hasPermission = allowedRoles.includes(req.user.chucVu);

    if (!hasPermission) {
      return res.status(403).json({ 
        message: "Bạn không có quyền thực hiện hành động này!", 
        requiredRoles: allowedRoles,
        yourRole: req.user.chucVu 
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
