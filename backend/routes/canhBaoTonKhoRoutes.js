const express = require("express");
const router = express.Router();
const CanhBaoTonKhoController = require("../controllers/CanhBaoTonKhoController");

router.get("/", CanhBaoTonKhoController.getAll);
router.get("/:id", CanhBaoTonKhoController.getById);
router.post("/", CanhBaoTonKhoController.create);

module.exports = router;
