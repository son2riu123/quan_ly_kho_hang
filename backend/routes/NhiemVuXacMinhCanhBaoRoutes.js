const express = require("express");
const router = express.Router();
const NhiemVuXacMinhCanhBaoController = require("../controllers/NhiemVuXacMinhCanhBaoController");

router.get("/", NhiemVuXacMinhCanhBaoController.getAll);
router.get("/:id", NhiemVuXacMinhCanhBaoController.getById);
router.post("/", NhiemVuXacMinhCanhBaoController.create);
router.post("/:id/result", NhiemVuXacMinhCanhBaoController.submitResult);

module.exports = router;
