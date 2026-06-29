const express = require('express');
const router = express.Router();
const NhatKyThaoTacController = require('../controllers/NhatKyThaoTacController');

router.get('/', NhatKyThaoTacController.getAll);
router.get('/:id', NhatKyThaoTacController.getById);
router.get('/nguoi/:nguoiThaoTac', NhatKyThaoTacController.getByNguoi);
router.get('/:id', NhatKyThaoTacController.getByDoiTuong);
router.post('/:id', NhatKyThaoTacController.create);

module.exports = router;