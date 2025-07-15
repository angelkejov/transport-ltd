const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/authMiddleware');
const { placeOrder } = require('../controllers/orderController');

router.post('/', authenticateToken, placeOrder);

module.exports = router;
