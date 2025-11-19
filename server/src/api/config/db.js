const mysql = require('mysql2/promise');

/**
 * MySQL Connection Pool
 * ----------------------
 * Purpose:
 *   - Create a reusable pool of MySQL connections.
 *   - Avoid opening a new DB connection for every request (better performance).
 *   - Use async/await because mysql2/promise is being used.
 *
 * Environment Variables (loaded from .env):
 *   - DB_HOST: Database server hostname
 *   - DB_USER: Username for DB authentication
 *   - DB_PASSWORD: Password for DB authentication
 *   - DB_NAME: Database name to connect to
 *
 * Options:
 *   waitForConnections: true
 *       → Queue incoming requests when all connections are busy.
 *
 *   connectionLimit: 10
 *       → Max number of active connections allowed in the pool at once.
 *         (Customize based on server resources.)
 *
 *   queueLimit: 0
 *       → 0 = unlimited queued connection requests.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export pool so other files can run queries using:
// const [rows] = await pool.query("SELECT * FROM users");
module.exports = pool;
