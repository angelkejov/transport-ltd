const pool = require('../config/db');

async function createUser({ name, email, password, isAdmin = 0, isVerified = 0, verificationToken }) {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, isAdmin, isVerified, verificationToken) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [name, email, password, isAdmin, isVerified, verificationToken]
  );
  return result.rows[0].id;
}

async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

async function verifyUser(token) {
  const result = await pool.query('UPDATE users SET isVerified = 1, verificationToken = NULL WHERE verificationToken = $1', [token]);
  return result.rowCount > 0;
}

async function getAllUsers() {
  const result = await pool.query('SELECT id, name, email, isAdmin, isVerified FROM users');
  return result.rows;
}

async function updateProfileById(id, { name }) {
  const result = await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, id]);
  return result.rowCount > 0;
}

async function deleteUserById(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
}

async function updateVerificationTokenByEmail(email, token) {
  const result = await pool.query('UPDATE users SET verificationToken = $1 WHERE email = $2', [token, email]);
  return result.rowCount > 0;
}

async function verifyUserByEmailAndToken(email, token) {
  const result = await pool.query('UPDATE users SET isVerified = 1, verificationToken = NULL WHERE email = $1 AND verificationToken = $2', [email, token]);
  return result.rowCount > 0;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  verifyUser,
  getAllUsers,
  updateProfileById,
  deleteUserById,
  updateVerificationTokenByEmail,
  verifyUserByEmailAndToken
};
