const pool = require('../../config/db');

const getAdminRecruiters = async (req, res) => {
  try {
    const [recruiters] = await pool.execute(`
      SELECT
        rp.user_id,
        rp.company_name,
        rp.company_website,
        rp.company_type,
        rp.hr_name,
        rp.hr_mobile,
        rp.address_line1,
        rp.address_line2,
        rp.city,
        rp.state,
        rp.country,
        rp.pincode,
        rp.status,
        rp.verification_notes,
        rp.created_at,
        rp.updated_at,
        u.email
      FROM recruiter_profiles rp
      LEFT JOIN users u ON rp.user_id = u.id
      ORDER BY rp.created_at DESC
    `);

    // Map status to verified for frontend compatibility
    const recruitersWithVerified = recruiters.map(recruiter => ({
      ...recruiter,
      verified: recruiter.status === 'approved' ? 1 : 0  // Add verified field (1 or 0)
    }));

    res.json({
      success: true,
      recruiters: recruitersWithVerified || []
    });
  } catch (error) {
    console.error('Admin get recruiters error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = getAdminRecruiters;