const pool = require('../config/db');

async function addRating({ stars, description }) {
  const result = await pool.query(
    'INSERT INTO ratings (stars, description) VALUES ($1, $2) RETURNING id',
    [stars, description]
  );
  return result.rows[0].id;
}

async function getAllRatings() {
  const result = await pool.query('SELECT * FROM ratings ORDER BY createdAt DESC');
  return result.rows;
}

async function getAverageRating() {
  const result = await pool.query('SELECT AVG(stars) as avg FROM ratings');
  return result.rows[0]?.avg || 0;
}

module.exports = {
  addRating,
  getAllRatings,
  getAverageRating
}; 