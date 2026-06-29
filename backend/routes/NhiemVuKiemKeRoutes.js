const express = require("express");
const router = express.Router();
const NhiemVuKiemKeController = require("../controllers/NhiemVuKiemKeController");

router.get("/", NhiemVuKiemKeController.getAll);
router.get("/:id", NhiemVuKiemKeController.getByMa);
router.post("/", NhiemVuKiemKeController.create);
router.put("/:id", NhiemVuKiemKeController.update);
router.delete("/:id", NhiemVuKiemKeController.delete);

module.exports = router;