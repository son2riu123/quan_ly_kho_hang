const express = require("express");
const router = express.Router();
const ChungTuGiaoHangController = require("../controllers/ChungTuGiaoHangController");

router.get("/", ChungTuGiaoHangController.getAll);
router.get("/:id", ChungTuGiaoHangController.getByMa);
router.post("/", ChungTuGiaoHangController.create);
router.put("/:id", ChungTuGiaoHangController.update);
router.delete("/:id", ChungTuGiaoHangController.delete);

module.exports = router;