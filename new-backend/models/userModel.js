const pool = require('../config/db');

async function createUser({ name, email, password, isAdmin = 0, isVerified = 0, verificationToken }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, isAdmin, isVerified, verificationToken) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, password, isAdmin, isVerified, verificationToken]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function verifyUser(token) {
  const [result] = await pool.execute('UPDATE users SET isVerified = 1, verificationToken = NULL WHERE verificationToken = ?', [token]);
  return result.affectedRows > 0;
}

async function getAllUsers() {
  const [rows] = await pool.execute('SELECT id, name, email, isAdmin, isVerified FROM users');
  return rows;
}

async function updateProfileById(id, { name }) {
  const [result] = await pool.execute('UPDATE users SET name = ? WHERE id = ?', [name, id]);
  return result.affectedRows > 0;
}

async function deleteUserById(id) {
  await pool.execute('DELETE FROM users WHERE id = ?', [id]);
}

async function updateVerificationTokenByEmail(email, token) {
  const [result] = await pool.execute('UPDATE users SET verificationToken = ? WHERE email = ?', [token, email]);
  return result.affectedRows > 0;
}

async function verifyUserByEmailAndToken(email, token) {
  const [result] = await pool.execute('UPDATE users SET isVerified = 1, verificationToken = NULL WHERE email = ? AND verificationToken = ?', [email, token]);
  return result.affectedRows > 0;
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
