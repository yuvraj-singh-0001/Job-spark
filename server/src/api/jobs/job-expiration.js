const pool = require('../config/db');

async function checkJobExpiration(req, res) {
  try {
    const jobId = req.params.id;
    const userId = req.user?.id;

    if (!jobId) {
      return res.status(400).json({ ok: false, message: 'Job ID is required' });
    }

    const [rows] = await pool.query(`
      SELECT
        id,
        expires_at,
        status,
        CASE
          WHEN expires_at <= NOW() THEN 1
          ELSE 0
        END as is_expired,
        DATEDIFF(expires_at, NOW()) as days_remaining
      FROM jobs
      WHERE id = ? AND recruiter_id = ?
    `, [jobId, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'Job not found' });
    }

    const job = rows[0];
    res.json({
      ok: true,
      job: {
        id: job.id,
        expiresAt: job.expires_at,
        isExpired: job.is_expired === 1,
        daysRemaining: job.days_remaining,
        status: job.status
      }
    });

  } catch (error) {
    console.error('Error checking job expiration:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
}

async function extendJobExpiration(req, res) {
  try {
    const jobId = req.params.id;
    const userId = req.user?.id;
    const { additionalDays = 30 } = req.body;

    if (!jobId) {
      return res.status(400).json({ ok: false, message: 'Job ID is required' });
    }

    if (additionalDays < 1 || additionalDays > 365) {
      return res.status(400).json({ ok: false, message: 'Additional days must be between 1 and 365' });
    }

    const [result] = await pool.query(`
      UPDATE jobs
      SET expires_at = DATE_ADD(expires_at, INTERVAL ? DAY), updated_at = NOW()
      WHERE id = ? AND recruiter_id = ? AND status = 'approved' AND expires_at > NOW()
    `, [additionalDays, jobId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Job not found or already expired' });
    }

    res.json({
      ok: true,
      message: `Job expiration extended by ${additionalDays} days`,
      additionalDays
    });

  } catch (error) {
    console.error('Error extending job expiration:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
}

async function getExpiringJobs(req, res) {
  try {
    const userId = req.user?.id;
    const { days = 7 } = req.query;

    if (!userId) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    const [rows] = await pool.query(`
      SELECT
        j.id,
        jr.name as title,
        j.company,
        j.expires_at,
        DATEDIFF(j.expires_at, NOW()) as days_remaining,
        j.status
      FROM jobs j
      LEFT JOIN job_roles jr ON j.role_id = jr.id
      WHERE j.recruiter_id = ?
      AND j.status = 'approved'
      AND j.expires_at > NOW()
      AND DATEDIFF(j.expires_at, NOW()) <= ?
      ORDER BY j.expires_at ASC
    `, [userId, days]);

    res.json({
      ok: true,
      expiringJobs: rows,
      count: rows.length
    });

  } catch (error) {
    console.error('Error getting expiring jobs:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
}

module.exports = { checkJobExpiration, extendJobExpiration, getExpiringJobs };
