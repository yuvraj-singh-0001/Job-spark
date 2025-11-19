const pool = require("../../config/db");

// GET /api/auth/users
async function getUsers(req, res) {
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        "SELECT id, username, email, role FROM users"
      );
      return res.json({ users: rows });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Get users error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = getUsers;
