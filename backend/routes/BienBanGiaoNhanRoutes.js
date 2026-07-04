const express = require("express");
const router = express.Router();
const BienBanGiaoNhanController = require("../controllers/BienBanGiaoNhanController");

router.get("/", BienBanGiaoNhanController.getAll);
router.get("/:id", BienBanGiaoNhanController.getByMa);
router.post("/", BienBanGiaoNhanController.create);
router.put("/:id", BienBanGiaoNhanController.update);
router.delete("/:id", BienBanGiaoNhanController.delete);

module.exports = router;