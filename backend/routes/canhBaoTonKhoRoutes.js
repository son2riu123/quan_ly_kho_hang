const express = require("express");
const router = express.Router();
const CanhBaoTonKhoController = require("../controllers/CanhBaoTonKhoController");

router.get("/", CanhBaoTonKhoController.getAll);
router.get("/:id", CanhBaoTonKhoController.getById);
router.post("/", CanhBaoTonKhoController.create);
router.put("/:id/status", CanhBaoTonKhoController.updateStatus);
router.get("/:id/pending-po", CanhBaoTonKhoController.getPendingPO);

module.exports = router;
