const express = require("express");
const router = express.Router();
const PhuongAnXuLyHangLoiController = require("../controllers/PhuongAnXuLyHangLoiController");

router.get("/", PhuongAnXuLyHangLoiController.getAll);
router.get("/:id", PhuongAnXuLyHangLoiController.getByMa);
router.post("/", PhuongAnXuLyHangLoiController.create);
router.put("/:id", PhuongAnXuLyHangLoiController.update);
router.delete("/:id", PhuongAnXuLyHangLoiController.delete);

module.exports = router;