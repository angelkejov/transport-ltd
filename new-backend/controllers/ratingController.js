const ratingModel = require('../models/ratingModel');

async function addRating(req, res) {
  try {
    const { stars, description } = req.body;
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Stars must be between 1 and 5' });
    }
    await ratingModel.addRating({ stars, description });
    res.status(201).json({ message: 'Rating added' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add rating', error: err.message });
  }
}

async function getAllRatings(req, res) {
  try {
    const ratings = await ratingModel.getAllRatings();
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get ratings', error: err.message });
  }
}

async function getAverageRating(req, res) {
  try {
    const avg = await ratingModel.getAverageRating();
    res.json({ average: avg });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get average rating', error: err.message });
  }
}

module.exports = { addRating, getAllRatings, getAverageRating }; 