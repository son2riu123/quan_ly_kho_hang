const express = require('express');
const router = express.Router();
const NhiemVuXuLySaiLechController = require('../controllers/NhiemVuXuLySaiLechController');

router.get('/', NhiemVuXuLySaiLechController.getAll);
router.get('/:id', NhiemVuXuLySaiLechController.getById);
router.get('/:maHoSo', NhiemVuXuLySaiLechController.getByHoSo);
router.post('/', NhiemVuXuLySaiLechController.create);
router.put('/:id', NhiemVuXuLySaiLechController.update);
router.delete('/:id', NhiemVuXuLySaiLechController.delete);

module.exports = router;