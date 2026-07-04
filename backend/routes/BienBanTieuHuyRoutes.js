const express = require("express");
const router = express.Router();
const BienBanTieuHuyController = require("../controllers/BienBanTieuHuyController");

router.get("/", BienBanTieuHuyController.getAll);
router.get("/:id", BienBanTieuHuyController.getByMa);
router.post("/", BienBanTieuHuyController.create);
router.put("/:id", BienBanTieuHuyController.update);
router.delete("/:id", BienBanTieuHuyController.delete);

module.exports = router;    