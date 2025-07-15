const pool = require('../config/db');

async function addRating({ stars, description }) {
  const [result] = await pool.execute(
    'INSERT INTO ratings (stars, description) VALUES (?, ?)',
    [stars, description]
  );
  return result.insertId;
}

async function getAllRatings() {
  const [rows] = await pool.execute('SELECT * FROM ratings ORDER BY createdAt DESC');
  return rows;
}

async function getAverageRating() {
  const [rows] = await pool.execute('SELECT AVG(stars) as avg FROM ratings');
  return rows[0]?.avg || 0;
}

module.exports = {
  addRating,
  getAllRatings,
  getAverageRating
}; 