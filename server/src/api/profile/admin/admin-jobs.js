const pool = require('../../config/db');

const getAdminJobs = async (req, res) => {
  try {
    const { status } = req.query;

    let sql = `
      SELECT 
        j.id,
        j.title,
        j.company,
        j.job_type,
        j.city,
        j.locality,
        j.min_experience,
        j.max_experience,
        j.salary,
        j.vacancies,
        j.description,
        j.contact_email,
        j.contact_phone,
        j.interview_address,
        j.logo_path,
        j.status,
        j.posted_at,
        j.created_at,
        j.updated_at,
        u.email as recruiter_email,
        rp.company_name
      FROM jobs j
      LEFT JOIN users u ON j.recruiter_id = u.id
      LEFT JOIN recruiter_profiles rp ON j.recruiter_id = rp.user_id
    `;

    // Add status filter if provided
    if (status && status !== 'all') {
      // Handle 'pending' status to include both 'pending' and NULL (for backward compatibility)
      if (status === 'pending') {
        sql += ` WHERE (j.status = ? OR j.status IS NULL)`;
      } else {
        sql += ` WHERE j.status = ?`;
      }
    }

    sql += ` ORDER BY j.created_at DESC`;

    const params = status && status !== 'all' ? [status] : [];
    const [jobs] = await pool.execute(sql, params);

    const jobsWithFormattedData = (jobs || []).map(job => {
      let experience = 'Not specified';
      if (job.min_experience == null && job.max_experience == null) experience = 'Fresher';
      else if (job.min_experience != null && job.max_experience == null) experience = `${job.min_experience}+ yrs`;
      else if (job.min_experience == null && job.max_experience != null) experience = `Up to ${job.max_experience} yrs`;
      else experience = `${job.min_experience}-${job.max_experience} yrs`;

      // Build location string safely handling null/undefined values
      let location = '';
      if (job.city) {
        location = job.city;
        if (job.locality) {
          location += `, ${job.locality}`;
        }
      } else if (job.locality) {
        location = job.locality;
      } else {
        location = 'Not specified';
      }

      return {
        ...job,
        experience,
        location
      };
    });

    res.json({
      success: true,
      jobs: jobsWithFormattedData
    });
  } catch (error) {
    console.error('Admin get jobs error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      query: req.query
    });
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = getAdminJobs;