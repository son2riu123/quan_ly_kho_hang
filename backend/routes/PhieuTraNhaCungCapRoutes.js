const express = require("express");
const router = express.Router();
const PhieuTraNhaCungCapController = require("../controllers/PhieuTraNhaCungCapController");

router.get("/", PhieuTraNhaCungCapController.getAll);
router.get("/:id", PhieuTraNhaCungCapController.getByMa);
router.post("/", PhieuTraNhaCungCapController.create);
router.put("/:id", PhieuTraNhaCungCapController.update);
router.delete("/:id", PhieuTraNhaCungCapController.delete);

module.exports = router;