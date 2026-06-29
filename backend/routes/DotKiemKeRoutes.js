const express = require('express');
const router = express.Router();
const DotKiemKeController = require('../controllers/DotKiemKeController');

router.get('/', DotKiemKeController.getAll);
router.post('/', DotKiemKeController.create);
router.delete('/:id', DotKiemKeController.delete);
router.put('/:id', DotKiemKeController.update);

module.exports = router;