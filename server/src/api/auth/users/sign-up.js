const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

// POST /api/auth/signup
async function signUp(req, res) {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }

    const conn = await pool.getConnection();
    try {
      const [existing] = await conn.execute(
        'SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1',
        [email, username]
      );
      if (existing.length) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const [result] = await conn.execute(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, passwordHash]
      );

      const user = { id: result.insertId, username, email };
      const token = signToken({ sub: user.id, username: user.username });

      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({ user, token, message: 'Signup successful' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = signUp;
