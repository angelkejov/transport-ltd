const pool = require('../config/db');

async function getOrdersByUserId(userId) {
  const [rows] = await pool.execute('SELECT * FROM orders WHERE userId = ?', [userId]);
  return rows;
}

async function getAllOrders() {
  const [rows] = await pool.execute('SELECT * FROM orders');
  return rows;
}

async function getAllOrdersWithUser() {
  const [rows] = await pool.execute(`
    SELECT o.*, u.name as userName, u.email as userEmail
    FROM orders o
    JOIN users u ON o.userId = u.id
    ORDER BY o.createdAt DESC
  `);
  return rows;
}

async function createOrder({ userId, service, details, phone }) {
  const [result] = await pool.execute('INSERT INTO orders (userId, service, details, phone, status) VALUES (?, ?, ?, ?, ?)', [userId, service, details, phone, 'pending']);
  return result.insertId;
}

async function updateOrderStatus(orderId, status) {
  try {
    const [result] = await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    console.log(`Updated order ${orderId} to status ${status}, affected rows: ${result.affectedRows}`);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database error in updateOrderStatus:', error);
    throw error;
  }
}

module.exports = {
  getOrdersByUserId,
  getAllOrders,
  createOrder,
  getAllOrdersWithUser,
  updateOrderStatus
};
