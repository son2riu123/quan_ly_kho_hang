const express = require("express");
const router = express.Router();
const YeuCauMuaBoSungController = require("../controllers/YeuCauMuaBoSungController");

router.get("/", YeuCauMuaBoSungController.getAll);
router.post("/", YeuCauMuaBoSungController.create);
router.put("/:id/status", YeuCauMuaBoSungController.updateStatus);

module.exports = router;
