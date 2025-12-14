
const jwt = require('jsonwebtoken');
const pool = require('../api/config/db');


function requireAuth(req, res, next) {
  try {
    // Extract token from cookies
    const token = req.cookies?.token;

    // If no token found, block access
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Verify token and extract payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach essential user details to req.user for use in next handlers
    // Include token issuance time (iat) as loginAt so frontend can show login time
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      full_name: payload.full_name, // Include full_name if present (for admin tokens)
      loginAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : undefined,
    };

    return next(); // Move to the next middleware/controller
  } catch (err) {
    // Token expired or invalid
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

/**
 * Handler: authCheck
 * -------------------
 * Purpose:
 *   - Return the currently authenticated user's data.
 *   - This handler must run after requireAuth middleware.
 *
 * Flow:
 *   1. Check if req.user exists.
 *   2. If not → return 401.
 *   3. Fetch complete user data from database.
 *   4. Send user object in response.
 */
async function authCheck(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Get DB connection from pool
    const conn = await pool.getConnection();
    try {
      let userRow;

      // Check if user is admin - admins are stored in a separate table
      if (req.user.role === 'admin') {
        // Query admins table
        const [adminRows] = await conn.execute(
          'SELECT admin_id, email, full_name, phone FROM admins WHERE admin_id = ? LIMIT 1',
          [req.user.id]
        );

        if (!adminRows.length) {
          return res.status(404).json({ message: 'Admin not found' });
        }

        const admin = adminRows[0];
        // Map admin fields to user format for consistency
        // Note: admins table doesn't have created_at or last_login columns
        userRow = {
          id: admin.admin_id,
          email: admin.email,
          role: 'admin',
          name: admin.full_name,
          full_name: admin.full_name,
          created_at: null, // Admins table doesn't have created_at column
          last_login: null // Admins table doesn't have last_login column
        };
      } else {
        // Regular users - query users table
        // First, check what columns exist in the users table
        const [columns] = await conn.query('SHOW COLUMNS FROM users');
        const columnNames = columns.map(col => col.Field);

        // Build SELECT query with only existing columns
        const selectFields = ['id', 'email', 'role'];
        if (columnNames.includes('name')) selectFields.push('name');
        if (columnNames.includes('created_at')) selectFields.push('created_at');
        if (columnNames.includes('last_login')) selectFields.push('last_login');

        const selectQuery = `SELECT ${selectFields.join(', ')} FROM users WHERE id = ? LIMIT 1`;

        // Fetch complete user data from database
        const [rows] = await conn.execute(selectQuery, [req.user.id]);

        if (!rows.length) {
          return res.status(404).json({ message: 'User not found' });
        }

        userRow = rows[0];
      }

      // Convert MySQL date objects to ISO strings for proper JSON serialization
      const formatDate = (dateValue) => {
        if (!dateValue) return null;
        // If it's already a string (ISO format or MySQL datetime string), return it
        if (typeof dateValue === 'string') {
          // If it's already in ISO format, return as is
          if (dateValue.includes('T') || dateValue.includes('Z')) {
            return dateValue;
          }
          // Otherwise, try to parse and convert to ISO
          const parsed = new Date(dateValue);
          return isNaN(parsed.getTime()) ? null : parsed.toISOString();
        }
        // If it's a Date object, convert to ISO string
        if (dateValue instanceof Date) {
          return isNaN(dateValue.getTime()) ? null : dateValue.toISOString();
        }
        // If it's a MySQL date object or other format, try to convert
        try {
          const parsed = new Date(dateValue);
          return isNaN(parsed.getTime()) ? null : parsed.toISOString();
        } catch (e) {
          return null;
        }
      };

      // Prepare user object with all required fields
      const user = {
        id: userRow.id,
        name: userRow.name || null,
        username: userRow.email, // Email is used as username
        email: userRow.email,
        role: userRow.role,
        created_at: formatDate(userRow.created_at),
        createdAt: formatDate(userRow.created_at), // Alias for compatibility
        last_login: formatDate(userRow.last_login),
        lastLogin: formatDate(userRow.last_login), // Alias for compatibility
        loginAt: formatDate(userRow.last_login) || req.user.loginAt, // Use last_login from DB, fallback to token iat
        full_name: userRow.name, // Alias for compatibility
        fullname: userRow.name, // Alias for compatibility
      };

      // Send user info to frontend
      return res.json({ user });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { requireAuth, authCheck };
