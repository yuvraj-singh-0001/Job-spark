require('dotenv').config();
const pool = require('./src/api/config/db');

async function runJobExpirationMigration() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await pool.getConnection();

    console.log('Running migration: Adding job expiration functionality...');

    // Check existing columns in jobs table
    const [tableColumns] = await connection.execute(`
      DESCRIBE jobs
    `);

    const columnNames = tableColumns.map(col => col.Field);
    console.log('Existing columns:', columnNames.join(', '));

    // Add expires_at column if it doesn't exist
    if (!columnNames.includes('expires_at')) {
      console.log('Adding expires_at column...');
      await connection.execute(`
        ALTER TABLE jobs
        ADD COLUMN expires_at TIMESTAMP NULL AFTER posted_at
      `);
    } else {
      console.log('expires_at column already exists, skipping...');
    }

    // Update existing jobs to expire 30 days from posted_at
    console.log('Setting expiration dates for existing jobs...');
    const [updateResult] = await connection.execute(`
      UPDATE jobs
      SET expires_at = DATE_ADD(posted_at, INTERVAL 30 DAY)
      WHERE expires_at IS NULL
    `);
    console.log(`Updated ${updateResult.affectedRows} existing jobs with expiration dates`);

    // Check if indexes exist and create them if needed
    console.log('Checking indexes...');
    const [indexes] = await connection.execute(`
      SHOW INDEX FROM jobs WHERE Key_name LIKE 'idx_jobs_expires%'
    `);

    if (indexes.length === 0) {
      console.log('Creating indexes for expiration functionality...');
      await connection.execute(`
        CREATE INDEX idx_jobs_expires_at ON jobs(expires_at)
      `);
      await connection.execute(`
        CREATE INDEX idx_jobs_status_expires ON jobs(status, expires_at)
      `);
      console.log('Indexes created successfully');
    } else {
      console.log('Indexes already exist, skipping...');
    }

    console.log('Job expiration migration completed successfully!');

    // Verify the changes
    console.log('Verifying table structure...');
    const [finalColumns] = await connection.execute(`
      DESCRIBE jobs
    `);

    console.log('Updated jobs table structure:');
    finalColumns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(required)'}`);
    });

  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released.');
    }
  }
}

runJobExpirationMigration().catch(error => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
