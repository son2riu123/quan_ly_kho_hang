const express = require('express');
const router = express.Router();
const DonViTinhController = require('../controllers/DonViTinhController');

router.get('/', DonViTinhController.getAll);

module.exports = router;
