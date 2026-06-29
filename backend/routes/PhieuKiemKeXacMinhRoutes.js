const express = require('express');
const router = express.Router();
const PhieuKiemKeXacMinhController = require('../controllers/PhieuKiemKeXacMinhController');

router.get('/', PhieuKiemKeXacMinhController.getAll);
router.get('/:id', PhieuKiemKeXacMinhController.getById);

router.get('/:id/chi-tiet', PhieuKiemKeXacMinhController.getByIdWithChiTiet);
router.get('/ho-so/:maHoSo', PhieuKiemKeXacMinhController.getByHoSo);
router.put('/:id', PhieuKiemKeXacMinhController.update);
router.post('/', PhieuKiemKeXacMinhController.create);
router.delete('/:id', PhieuKiemKeXacMinhController.delete);

module.exports = router;