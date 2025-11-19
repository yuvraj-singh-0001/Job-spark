const pool = require("../../config/db");

// GET /api/auth/users/:id
async function getUser(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "User id is required" });
    // Debug: log requested id
    console.debug && console.debug("getUser: requested id =", id);

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        "SELECT id, username, email, role FROM users WHERE id = ? LIMIT 1",
        [id]
      );
      // Debug: log result count
      console.debug && console.debug("getUser: rows.length =", rows.length);
      if (!rows.length)
        return res.status(404).json({ message: "User not found" });
      return res.json({ user: rows[0] });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Get user error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = getUser;
