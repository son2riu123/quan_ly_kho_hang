const express = require('express');
const router = express.Router();
const TheKhoController = require('../controllers/TheKhoController');

router.get('/', TheKhoController.getAllCards);
router.get('/:id', TheKhoController.getCardDetails);
router.post('/', TheKhoController.createCard);
router.post('/log', TheKhoController.addLogEntry);

module.exports = router;
