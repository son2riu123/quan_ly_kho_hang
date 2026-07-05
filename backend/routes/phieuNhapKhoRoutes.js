const express = require('express');
const router = express.Router();
const PhieuNhapKhoController = require('../controllers/PhieuNhapKhoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', PhieuNhapKhoController.getAll);
router.get('/:id', PhieuNhapKhoController.getByMa);
router.post('/', authMiddleware, PhieuNhapKhoController.create);

module.exports = router;
