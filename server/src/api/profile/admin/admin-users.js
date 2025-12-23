const pool = require('../../config/db');

const getAdminUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT 
        up.user_id,
        up.full_name,
        up.phone,
        up.city,
        up.state,
        up.country,
        up.experience_years,
        up.highest_qualification,
        up.created_at,
        u.email
      FROM candidate_profiles up
      LEFT JOIN users u ON up.user_id = u.id
      ORDER BY up.created_at DESC
    `);
    // Send response
    res.json({
      success: true,
      users: users || []
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = getAdminUsers;