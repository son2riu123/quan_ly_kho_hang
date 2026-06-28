const express = require('express');
const router = express.Router();
const MatHangController = require('../controllers/MatHangController');

router.get('/', MatHangController.getAll);
router.get('/:id', MatHangController.getByMa);
router.post('/', MatHangController.create);
router.put('/:id', MatHangController.update);
router.delete('/:id', MatHangController.delete);

module.exports = router;
