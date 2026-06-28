const express = require('express');
const router = express.Router();
const DonMuaHangController = require('../controllers/DonMuaHangController');

router.get('/', DonMuaHangController.getAll);
router.get('/:id', DonMuaHangController.getByMa);
router.post('/', DonMuaHangController.create);

module.exports = router;
