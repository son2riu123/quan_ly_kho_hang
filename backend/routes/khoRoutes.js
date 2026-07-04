const express = require('express');
const router = express.Router();
const KhoController = require('../controllers/KhoController');

router.get('/', KhoController.getAll);
router.get('/:id', KhoController.getByMa);
router.post('/', KhoController.create);
router.put('/:id', KhoController.update);
router.delete('/:id', KhoController.delete);

module.exports = router;
