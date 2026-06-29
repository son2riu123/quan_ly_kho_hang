const express = require('express');
const router = express.Router();
const PhieuKiemKeController = require('../controllers/PhieuKiemKeController');

router.get('/', PhieuKiemKeController.getAll);
router.get('/:id', PhieuKiemKeController.getById);
router.post('/', PhieuKiemKeController.create);
router.delete('/:id', PhieuKiemKeController.delete);

module.exports = router;