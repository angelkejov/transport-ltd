const pool = require('../config/db');

async function getOrdersByUserId(userId) {
  const result = await pool.query('SELECT * FROM orders WHERE userId = $1', [userId]);
  return result.rows;
}

async function getAllOrders() {
  const result = await pool.query('SELECT * FROM orders');
  return result.rows;
}

async function getAllOrdersWithUser() {
  const result = await pool.query(`
    SELECT o.*, u.name as userName, u.email as userEmail
    FROM orders o
    JOIN users u ON o.userId = u.id
    ORDER BY o.createdAt DESC
  `);
  return result.rows;
}

async function createOrder({ userId, service, details, phone }) {
  const result = await pool.query('INSERT INTO orders (userId, service, details, phone, status) VALUES ($1, $2, $3, $4, $5) RETURNING id', [userId, service, details, phone, 'pending']);
  return result.rows[0].id;
}

async function updateOrderStatus(orderId, status) {
  try {
    const result = await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);
    console.log(`Updated order ${orderId} to status ${status}, affected rows: ${result.rowCount}`);
    return result.rowCount > 0;
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
