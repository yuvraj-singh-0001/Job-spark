const pool = require('../api/config/db');
const logger = require('../utils/logger');

async function expireOldJobs() {
  try {
    const [result] = await pool.query(`
      UPDATE jobs
      SET status = 'closed', updated_at = NOW()
      WHERE status = 'approved'
      AND expires_at <= NOW()
      AND expires_at IS NOT NULL
    `);

    if (result.affectedRows > 0) {
      logger.info(`Closed ${result.affectedRows} expired jobs`);
    } else {
      logger.info('No expired jobs found to close');
    }

    return result.affectedRows;
  } catch (error) {
    console.error('Error in job expiration cleanup:', error);
    throw error;
  }
}

module.exports = { expireOldJobs };
