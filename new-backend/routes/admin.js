const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../utils/authMiddleware');
const { getAllUsers, getAllOrders, getAllGallery } = require('../controllers/adminController');
const { approveOrder, rejectOrder } = require('../controllers/orderController');

router.get('/users', authenticateToken, requireAdmin, getAllUsers);
router.get('/orders', authenticateToken, requireAdmin, getAllOrders);
router.get('/gallery', authenticateToken, requireAdmin, getAllGallery);
router.post('/orders/:id/approve', authenticateToken, requireAdmin, approveOrder);
router.post('/orders/:id/reject', authenticateToken, requireAdmin, rejectOrder);

module.exports = router;
