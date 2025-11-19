const bcrypt = require("bcryptjs");
const pool = require("../../config/db");

// PUT /api/auth/users/:id
async function updateUser(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "User id is required" });

    const { username, email, role, password } = req.body || {};
    if (!username && !email && !role && !password) {
      return res
        .status(400)
        .json({
          message:
            "At least one field (username, email, role, password) is required",
        });
    }

    const conn = await pool.getConnection();
    try {
      // Check uniqueness of username/email if provided
      if (username || email) {
        const [existing] = await conn.execute(
          "SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ? LIMIT 1",
          [email || "", username || "", id]
        );
        if (existing.length) {
          return res
            .status(409)
            .json({ message: "Email or username already taken" });
        }
      }

      const fields = [];
      const params = [];
      if (username) {
        fields.push("username = ?");
        params.push(username);
      }
      if (email) {
        fields.push("email = ?");
        params.push(email);
      }
      if (role) {
        fields.push("role = ?");
        params.push(role);
      }
      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        fields.push("password_hash = ?");
        params.push(passwordHash);
      }

      if (!fields.length) {
        return res.status(400).json({ message: "Nothing to update" });
      }

      params.push(id);
      const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
      const [result] = await conn.execute(sql, params);
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "User not found" });

      // Return updated user (safe fields only)
      const [rows] = await conn.execute(
        "SELECT id, username, email, role FROM users WHERE id = ? LIMIT 1",
        [id]
      );
      return res.json({ user: rows[0], message: "User updated" });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Update user error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = updateUser;
