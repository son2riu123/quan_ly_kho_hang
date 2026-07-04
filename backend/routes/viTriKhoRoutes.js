const express = require('express');
const router = express.Router();
const ViTriKhoController = require('../controllers/ViTriKhoController');

router.get('/', ViTriKhoController.getAll);
router.get('/:id', ViTriKhoController.getByMa);
router.post('/', ViTriKhoController.create);
router.put('/:id', ViTriKhoController.update);
router.delete('/:id', ViTriKhoController.delete);

module.exports = router;
