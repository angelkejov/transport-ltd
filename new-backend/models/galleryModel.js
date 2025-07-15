const pool = require('../config/db');

async function getAllImages() {
  const result = await pool.query('SELECT * FROM gallery ORDER BY createdAt DESC');
  return result.rows;
}

async function addImage({ url, title, mediaType = 'image' }) {
  const result = await pool.query('INSERT INTO gallery (url, title, mediaType) VALUES ($1, $2, $3) RETURNING id', [url, title, mediaType]);
  return result.rows[0].id;
}

async function deleteImageById(id) {
  const result = await pool.query('DELETE FROM gallery WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = {
  getAllImages,
  addImage,
  deleteImageById
};
