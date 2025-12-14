const pool = require('../../config/db');

const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, rejection_reason } = req.body;

    // Validate status
    const validStatuses = ['draft', 'pending', 'approved', 'rejected', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Try to update with rejection_reason if provided
    // If column doesn't exist, it will fail and we'll retry without it
    if (rejection_reason !== undefined && rejection_reason !== null && rejection_reason.trim()) {
      try {
        await pool.execute(
          'UPDATE jobs SET status = ?, rejection_reason = ?, updated_at = NOW() WHERE id = ?',
          [status, rejection_reason.trim(), jobId]
        );
        return res.json({
          success: true,
          message: `Job status updated to ${status} successfully`
        });
      } catch (error) {
        // If error is due to unknown column, fall through to update without rejection_reason
        if (error.code === 'ER_BAD_FIELD_ERROR' && error.message.includes('rejection_reason')) {
          console.log('rejection_reason column not found, updating without it');
          // Fall through to update without rejection_reason
        } else {
          throw error; // Re-throw if it's a different error
        }
      }
    }

    // Update without rejection_reason (either not provided or column doesn't exist)
    await pool.execute(
      'UPDATE jobs SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, jobId]
    );

    res.json({
      success: true,
      message: `Job status updated to ${status} successfully`
    });
  } catch (error) {
    console.error('Admin update job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = updateJobStatus;