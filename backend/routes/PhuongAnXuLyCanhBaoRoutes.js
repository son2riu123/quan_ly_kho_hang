const express = require("express");
const router = express.Router();
const PhuongAnXuLyCanhBaoController = require("../controllers/PhuongAnXuLyCanhBaoController");

router.get("/", PhuongAnXuLyCanhBaoController.getAll);
router.post("/", PhuongAnXuLyCanhBaoController.create);

module.exports = router;
