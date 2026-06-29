const express = require("express");
const router = express.Router();
const BienBanKiemNghiemController = require("../controllers/BienBanKiemNghiemController");

router.get("/", BienBanKiemNghiemController.getAll);
router.get("/:id", BienBanKiemNghiemController.getByMa);
router.post("/", BienBanKiemNghiemController.create);
router.put("/:id", BienBanKiemNghiemController.update);
router.delete("/:id", BienBanKiemNghiemController.delete);

module.exports = router;