const express = require("express");
const router = express.Router();
const LoHangController = require("../controllers/LoHangController");

router.get("/", LoHangController.getAll);
router.get("/:id", LoHangController.getByMa);
router.post("/", LoHangController.create);
router.put("/:id", LoHangController.update);
router.delete("/:id", LoHangController.delete);

module.exports = router;