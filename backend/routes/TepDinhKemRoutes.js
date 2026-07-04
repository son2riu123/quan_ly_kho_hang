const express = require('express');
const router = express.Router();
const TepDinhKemController = require('../controllers/TepDinhKemController');

router.get('/doi-tuong', TepDinhKemController.getByDoiTuong);
router.get('/:id', TepDinhKemController.getByDoiTuong);
router.post('/', TepDinhKemController.create);
router.delete('/:id', TepDinhKemController.delete);
router.get('/', TepDinhKemController.getAll);

module.exports = router;