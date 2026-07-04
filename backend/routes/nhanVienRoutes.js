const express = require('express');
const router = express.Router();
const NhanVienController = require('../controllers/NhanVienController');

router.get('/', NhanVienController.getAll);
router.get('/:id', NhanVienController.getByMa);
router.post('/', NhanVienController.create);
router.put('/:id', NhanVienController.update);
router.delete('/:id', NhanVienController.delete);

module.exports = router;
