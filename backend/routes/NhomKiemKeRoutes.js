const express = require("express");
const router = express.Router();
const NhomKiemKeController = require("../controllers/NhomKiemKeController");

router.get("/", NhomKiemKeController.getAll);
router.get("/:id", NhomKiemKeController.getByMa);
router.post("/", NhomKiemKeController.create);
router.put("/:id", NhomKiemKeController.update);
router.delete("/:id", NhomKiemKeController.delete);

module.exports = router;