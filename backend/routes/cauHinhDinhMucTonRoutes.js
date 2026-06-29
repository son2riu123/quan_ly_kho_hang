const express = require("express");
const router = express.Router();
const CauHinhDinhMucTonController = require("../controllers/CauHinhDinhMucTonController");

router.get("/", CauHinhDinhMucTonController.getAll);
router.get("/:id", CauHinhDinhMucTonController.getById);
router.post("/", CauHinhDinhMucTonController.create);

module.exports = router;
