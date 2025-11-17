const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

// POST /api/auth/login
async function signIn(req, res) {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({ message: 'identifier (email or username) and password are required' });
    }

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT id, username, email, password_hash FROM users WHERE email = ? OR username = ? LIMIT 1',
        [identifier, identifier]
      );
      if (!rows.length) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const userRow = rows[0];
      const valid = await bcrypt.compare(password, userRow.password_hash);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = { id: userRow.id, username: userRow.username, email: userRow.email };
      const token = signToken({ sub: user.id, username: user.username });

      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ user, token, message: 'Login successful' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = signIn;
