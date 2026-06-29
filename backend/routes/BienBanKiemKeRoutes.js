const express = require('express');
const router = express.Router();
const BienBanKiemKeController = require('../controllers/BienBanKiemKeController');

router.get('/', BienBanKiemKeController.getAll);
router.get('/:id', BienBanKiemKeController.getById);
router.post('/', BienBanKiemKeController.create);
router.delete('/:id', BienBanKiemKeController.delete);

module.exports = router;