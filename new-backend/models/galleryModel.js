const pool = require('../config/db');

async function getAllImages() {
  const [rows] = await pool.execute('SELECT * FROM gallery ORDER BY createdAt DESC');
  return rows;
}

async function addImage({ url, title, mediaType = 'image' }) {
  const [result] = await pool.execute('INSERT INTO gallery (url, title, mediaType) VALUES (?, ?, ?)', [url, title, mediaType]);
  return result.insertId;
}

async function deleteImageById(id) {
  const [result] = await pool.execute('DELETE FROM gallery WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllImages,
  addImage,
  deleteImageById
};
