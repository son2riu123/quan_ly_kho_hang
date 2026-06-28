const express = require("express");
const router = express.Router();
const QuyCachDongGoiController = require("../controllers/QuyCachDongGoiController");

router.get("/", QuyCachDongGoiController.getAll);
router.get("/:id", QuyCachDongGoiController.getByMa);
router.post("/", QuyCachDongGoiController.create);
router.put("/:id", QuyCachDongGoiController.update);
router.delete("/:id", QuyCachDongGoiController.delete);

module.exports = router;