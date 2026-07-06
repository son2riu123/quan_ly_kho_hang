const jwtUtils = require("../utils/jwtUtils");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không tìm thấy Token. Truy cập bị từ chối!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtUtils.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

module.exports = authMiddleware;
