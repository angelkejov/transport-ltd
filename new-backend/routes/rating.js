const express = require('express');
const router = express.Router();
const { addRating, getAllRatings, getAverageRating } = require('../controllers/ratingController');

// Anonymous rating submission
router.post('/', addRating);
// Get all ratings (for admin)
router.get('/', getAllRatings);
// Get average rating
router.get('/average', getAverageRating);

module.exports = router; 