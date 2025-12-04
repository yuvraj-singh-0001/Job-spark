const pool = require('../../config/db');

const verifyRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { verified } = req.body; // 0 or 1

    if (typeof verified === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'verified field is required (0 or 1)'
      });
    }

    // Convert verified (0/1) to status
    const status = verified === 1 ? 'approved' : 'pending';
    
    await pool.execute(
      'UPDATE recruiter_profiles SET status = ? WHERE user_id = ?',
      [status, recruiterId]
    );

    res.json({
      success: true,
      message: `Recruiter ${verified === 1 ? 'verified' : 'unverified'} successfully`
    });
  } catch (error) {
    console.error('Admin verify recruiter error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = verifyRecruiter;