const express = require("express");
const router = express.Router();
const TaiKhoanController = require("../controllers/TaiKhoanController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post("/login", TaiKhoanController.login);
router.post("/register", authMiddleware, roleMiddleware(["Quản lý kho"]), TaiKhoanController.createAccount);
router.put("/reset-password", authMiddleware, roleMiddleware(["Quản lý kho"]), TaiKhoanController.resetPassword);
router.get("/", authMiddleware, TaiKhoanController.getAll);

module.exports = router;
