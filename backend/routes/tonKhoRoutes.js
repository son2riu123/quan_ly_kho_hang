const express = require('express');
const router = express.Router();
const TonKhoController = require('../controllers/TonKhoController');

router.get('/', TonKhoController.getAll);
router.get('/summary', TonKhoController.getSummary);

module.exports = router;
