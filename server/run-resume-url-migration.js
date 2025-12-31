require('dotenv').config();
const pool = require('./src/api/config/db');

async function runResumeUrlMigration() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await pool.getConnection();

    console.log('Running migration: Updating resume URLs to full URLs...');

    // Check current resume paths before migration
    console.log('Checking existing resume paths...');

    const [candidateProfiles] = await connection.execute(`
      SELECT COUNT(*) as count, resume_path
      FROM candidate_profiles
      WHERE resume_path IS NOT NULL
      GROUP BY resume_path
      LIMIT 5
    `);

    const [jobApplications] = await connection.execute(`
      SELECT COUNT(*) as count, resume_path
      FROM job_applications
      WHERE resume_path IS NOT NULL
      GROUP BY resume_path
      LIMIT 5
    `);

    console.log('Sample candidate_profiles resume paths:');
    candidateProfiles.forEach(row => {
      console.log(`- ${row.resume_path}`);
    });

    console.log('Sample job_applications resume paths:');
    jobApplications.forEach(row => {
      console.log(`- ${row.resume_path}`);
    });

    // Update candidate_profiles resume paths
    console.log('Updating candidate_profiles resume paths...');
    const [candidateResult] = await connection.execute(`
      UPDATE candidate_profiles
      SET resume_path = CONCAT('http://localhost:5000', resume_path)
      WHERE resume_path LIKE '/uploads/%'
    `);

    console.log(`Updated ${candidateResult.affectedRows} candidate_profiles records`);

    // Update job_applications resume paths
    console.log('Updating job_applications resume paths...');
    const [jobResult] = await connection.execute(`
      UPDATE job_applications
      SET resume_path = CONCAT('http://localhost:5000', resume_path)
      WHERE resume_path LIKE '/uploads/%'
    `);

    console.log(`Updated ${jobResult.affectedRows} job_applications records`);

    // Verify the changes
    console.log('Verifying updated resume paths...');
    const [updatedCandidates] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM candidate_profiles
      WHERE resume_path LIKE 'http://localhost:5000/%'
    `);

    const [updatedJobs] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM job_applications
      WHERE resume_path LIKE 'http://localhost:5000/%'
    `);

    console.log(`Total candidate_profiles with full URLs: ${updatedCandidates[0].count}`);
    console.log(`Total job_applications with full URLs: ${updatedJobs[0].count}`);

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released.');
    }
    process.exit(0);
  }
}

runResumeUrlMigration().catch(error => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
