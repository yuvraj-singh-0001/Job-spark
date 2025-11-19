const pool = require("../../config/db");

// DELETE /api/auth/users/:id
async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "User id is required" });

    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute("DELETE FROM users WHERE id = ?", [
        id,
      ]);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "User not found" });
      return res.json({ message: "User deleted" });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Delete user error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = deleteUser;
