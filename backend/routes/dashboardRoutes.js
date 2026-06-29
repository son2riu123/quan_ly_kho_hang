const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

router.get('/stats', DashboardController.getStats);

module.exports = router;
