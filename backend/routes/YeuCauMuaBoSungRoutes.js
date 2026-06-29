const express = require("express");
const router = express.Router();
const YeuCauMuaBoSungController = require("../controllers/YeuCauMuaBoSungController");

router.get("/", YeuCauMuaBoSungController.getAll);
router.post("/", YeuCauMuaBoSungController.create);

module.exports = router;
