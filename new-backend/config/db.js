const mysql = require('mysql2/promise');
require('dotenv').config();
const url = require('url');

let pool;

if (process.env.MYSQL_URL) {
  // Parse MYSQL_URL (mysql://user:pass@host:port/dbname)
  const dbUrl = new url.URL(process.env.MYSQL_URL);
  pool = mysql.createPool({
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace(/^\//, ''),
    port: dbUrl.port || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

module.exports = pool;
