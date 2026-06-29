const express = require("express");
const router = express.Router();
const BienDongTonKhoController = require("../controllers/BienDongTonKhoController");

router.get("/", BienDongTonKhoController.getAll);
router.get("/:id", BienDongTonKhoController.getByMa);
router.post("/", BienDongTonKhoController.create);

module.exports = router;