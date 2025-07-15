const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/authMiddleware');
const { getProfile, updateProfile, getOrderHistory } = require('../controllers/userController');

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/orders', authenticateToken, getOrderHistory);

module.exports = router;
