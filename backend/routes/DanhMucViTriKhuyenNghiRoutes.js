const express = require("express");
const router = express.Router();
const DanhMucViTriKhuyenNghiController = require("../controllers/DanhMucViTriKhuyenNghiController");

router.get("/", DanhMucViTriKhuyenNghiController.getAll);
router.get("/:id", DanhMucViTriKhuyenNghiController.getByMa);
router.post("/", DanhMucViTriKhuyenNghiController.create);
router.put("/:id", DanhMucViTriKhuyenNghiController.update);
router.delete("/:id", DanhMucViTriKhuyenNghiController.delete);

module.exports = router;