require('dotenv').config();
const pool = require('./src/api/config/db');

async function runStatusMigration() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await pool.getConnection();

    console.log('Running migration: Updating job_applications status ENUM...');

    // Check current status column definition
    const [tableColumns] = await connection.execute(`
      DESCRIBE job_applications
    `);

    const statusColumn = tableColumns.find(col => col.Field === 'status');
    console.log('Current status column:', statusColumn);

    // Update the status column ENUM
    console.log('Updating status column ENUM...');
    await connection.execute(`
      ALTER TABLE job_applications
      MODIFY COLUMN status ENUM('applied','shortlisted','rejected')
      NOT NULL DEFAULT 'applied'
    `);

    console.log('Migration completed successfully!');

    // Verify the changes
    console.log('Verifying table structure...');
    const [finalColumns] = await connection.execute(`
      DESCRIBE job_applications
    `);

    const updatedStatusColumn = finalColumns.find(col => col.Field === 'status');
    console.log('Updated status column:', updatedStatusColumn);

    // Check if any existing data needs to be updated
    const [existingData] = await connection.execute(`
      SELECT status, COUNT(*) as count
      FROM job_applications
      GROUP BY status
    `);

    console.log('Existing status distribution:');
    existingData.forEach(row => {
      console.log(`- ${row.status}: ${row.count} records`);
    });

    // If there are 'interview_called' or 'closed' statuses, they need to be updated
    const invalidStatuses = existingData.filter(row =>
      row.status === 'interview_called' || row.status === 'closed'
    );

    if (invalidStatuses.length > 0) {
      console.log('Updating invalid statuses...');
      // Update 'interview_called' and 'closed' to 'rejected'
      await connection.execute(`
        UPDATE job_applications
        SET status = 'rejected'
        WHERE status IN ('interview_called', 'closed')
      `);
      console.log('Invalid statuses updated to "rejected"');
    }

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

runStatusMigration().catch(error => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
