const pool = require('../config/db');

/**
 * GET /api/jobs/filters
 * Returns dynamic filter options based on approved jobs only:
 * - cities: distinct cities from jobs.city where status='approved'
 * - titles: distinct titles from jobs.title where status='approved'
 * - tags: distinct tags from job_tags joined with job_tag_map and jobs where status='approved'
 */
async function getFilters(req, res) {
  try {
    // Fetch distinct cities from approved jobs
    const [cityRows] = await pool.query(`
      SELECT DISTINCT city 
      FROM jobs 
      WHERE status = 'approved' AND city IS NOT NULL AND city != ''
      ORDER BY city ASC
    `);

    // Fetch distinct job titles from approved jobs
    const [titleRows] = await pool.query(`
      SELECT DISTINCT title 
      FROM jobs 
      WHERE status = 'approved' AND title IS NOT NULL AND title != ''
      ORDER BY title ASC
    `);

    // Fetch distinct tags from approved jobs via job_tag_map
    let tags = [];
    try {
      const [tagRows] = await pool.query(`
        SELECT DISTINCT jt.name as tag
        FROM job_tags jt
        INNER JOIN job_tag_map jtm ON jt.id = jtm.tag_id
        INNER JOIN jobs j ON jtm.job_id = j.id
        WHERE j.status = 'approved' AND jt.name IS NOT NULL AND jt.name != ''
        ORDER BY jt.name ASC
      `);
      tags = tagRows.map(row => row.tag);
    } catch (e) {
      // If tag tables don't exist or there's an error, return empty array
      console.error('Error fetching tags:', e.message);
    }

    const cities = cityRows.map(row => row.city);
    const titles = titleRows.map(row => row.title);

    res.json({
      ok: true,
      filters: {
        cities,
        titles,
        tags
      }
    });
  } catch (err) {
    console.error('GET /api/jobs/filters error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = getFilters;
