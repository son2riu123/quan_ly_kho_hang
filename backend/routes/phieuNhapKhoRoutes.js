const express = require('express');
const router = express.Router();
const PhieuNhapKhoController = require('../controllers/PhieuNhapKhoController');

router.get('/', PhieuNhapKhoController.getAll);
router.get('/:id', PhieuNhapKhoController.getByMa);
router.post('/', PhieuNhapKhoController.create);

module.exports = router;
