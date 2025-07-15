const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/authMiddleware');
const { getGallery, addImage, uploadFiles, deleteImage } = require('../controllers/galleryController');
const upload = require('../utils/uploadMiddleware');
const path = require('path');

// Public routes
router.get('/', getGallery);

// Protected routes (require authentication)
router.post('/', authenticateToken, addImage);
router.post('/upload', authenticateToken, upload.array('files', 10), uploadFiles);
router.delete('/:id', authenticateToken, deleteImage);

module.exports = router;
