const express = require('express');
const router = express.Router();
const PhuongAnXuLySaiLechController = require('../controllers/PhuongAnXuLySaiLechController');

router.get('/ho-so/:maHoSo', PhuongAnXuLySaiLechController.getByHoSo);
router.post('/', PhuongAnXuLySaiLechController.create);

module.exports = router;