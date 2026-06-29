const express = require('express');
const router = express.Router();
const HoSoXuLySaiLechTonKhoController = require('../controllers/HoSoXuLySaiLechTonKhoController');

router.get('/', HoSoXuLySaiLechTonKhoController.getAll);
router.get('/:id', HoSoXuLySaiLechTonKhoController.getByMa);
router.post('/', HoSoXuLySaiLechTonKhoController.create);
router.put('/:id', HoSoXuLySaiLechTonKhoController.update);
router.delete('/:id', HoSoXuLySaiLechTonKhoController.delete);

module.exports = router;