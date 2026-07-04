const express = require("express");
const router = express.Router();
const PhieuCachLyHangController = require("../controllers/PhieuCachLyHangController");

router.get("/", PhieuCachLyHangController.getAll);
router.get("/:id", PhieuCachLyHangController.getByMa);
router.post("/", PhieuCachLyHangController.create);
router.put("/:id", PhieuCachLyHangController.update);
router.delete("/:id", PhieuCachLyHangController.delete);

module.exports = router;