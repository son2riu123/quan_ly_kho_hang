const express = require("express");
const router = express.Router();
const PhieuBaoCaoHangLoiController = require("../controllers/PhieuBaoCaoHangLoiController");

router.get("/", PhieuBaoCaoHangLoiController.getAll);
router.get("/:id", PhieuBaoCaoHangLoiController.getByMa);
router.post("/", PhieuBaoCaoHangLoiController.create);
router.put("/:id", PhieuBaoCaoHangLoiController.update);
router.delete("/:id", PhieuBaoCaoHangLoiController.delete);

module.exports = router;