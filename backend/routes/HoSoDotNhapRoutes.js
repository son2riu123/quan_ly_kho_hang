const express = require("express");
const router = express.Router();
const HoSoDotNhapController = require("../controllers/HoSoDotNhapController");

router.get("/", HoSoDotNhapController.getAll);
router.get("/:id", HoSoDotNhapController.getByMa);
router.post("/", HoSoDotNhapController.create);
router.put("/:id", HoSoDotNhapController.update);
router.delete("/:id", HoSoDotNhapController.delete);

module.exports = router;