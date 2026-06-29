const express = require("express");
const router = express.Router();
const LenhXuLyHangLoiController = require("../controllers/LenhXuLyHangLoiController");

router.get("/", LenhXuLyHangLoiController.getAll);
router.get("/:id", LenhXuLyHangLoiController.getByMa);
router.post("/", LenhXuLyHangLoiController.create);
router.put("/:id", LenhXuLyHangLoiController.update);
router.delete("/:id", LenhXuLyHangLoiController.delete);

module.exports = router;