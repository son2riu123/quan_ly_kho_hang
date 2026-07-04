const express = require("express");
const router = express.Router();
const HoSoXuLyHangLoiController = require("../controllers/HoSoXuLyHangLoiController");

router.get("/", HoSoXuLyHangLoiController.getAll);
router.get("/:id", HoSoXuLyHangLoiController.getByMa);
router.post("/", HoSoXuLyHangLoiController.create);
router.put("/:id", HoSoXuLyHangLoiController.update);
router.delete("/:id", HoSoXuLyHangLoiController.delete);

module.exports = router;