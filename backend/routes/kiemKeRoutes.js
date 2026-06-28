const express = require('express');
const router = express.Router();
const KiemKeController = require('../controllers/KiemKeController');

router.get('/dot', KiemKeController.getAllDots);
router.get('/dot/:id', KiemKeController.getDotByMa);
router.post('/dot', KiemKeController.createDot);
router.get('/phieu/:id', KiemKeController.getPhieuDetails);
router.post('/phieu', KiemKeController.createPhieu);

module.exports = router;
