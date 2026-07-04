const express = require('express');
const router = express.Router();
const PhuongAnXuLySaiLechController = require('../controllers/PhuongAnXuLySaiLechController');

router.get('/', PhuongAnXuLySaiLechController.getAll);
router.get('/:id', PhuongAnXuLySaiLechController.getById);
router.get('/:maHoSo', PhuongAnXuLySaiLechController.getByHoSo);
router.post('/', PhuongAnXuLySaiLechController.create);
router.put('/:id', PhuongAnXuLySaiLechController.update);
router.delete('/:id', PhuongAnXuLySaiLechController.delete);

module.exports = router;