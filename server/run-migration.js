require('dotenv').config();
const pool = require('./src/api/config/db');

async function runMigration() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await pool.getConnection();

    console.log('Running migration: Adding HR fields to recruiter_profiles table...');

    // Check existing columns
    const [tableColumns] = await connection.execute(`
      DESCRIBE recruiter_profiles
    `);

    const columnNames = tableColumns.map(col => col.Field);
    console.log('Existing columns:', columnNames.join(', '));

    // Add hr_name column if it doesn't exist
    if (!columnNames.includes('hr_name')) {
      console.log('Adding hr_name column...');
      await connection.execute(`
        ALTER TABLE recruiter_profiles
        ADD COLUMN hr_name VARCHAR(255) NULL AFTER company_type
      `);
    } else {
      console.log('hr_name column already exists, skipping...');
    }

    // Add hr_mobile column if it doesn't exist
    if (!columnNames.includes('hr_mobile')) {
      console.log('Adding hr_mobile column...');
      await connection.execute(`
        ALTER TABLE recruiter_profiles
        ADD COLUMN hr_mobile VARCHAR(15) NULL AFTER hr_name
      `);
    } else {
      console.log('hr_mobile column already exists, skipping...');
    }

    console.log('Migration completed successfully!');

    // Verify the changes
    console.log('Verifying table structure...');
    const [finalColumns] = await connection.execute(`
      DESCRIBE recruiter_profiles
    `);

    console.log('Updated table structure:');
    finalColumns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(required)'}`);
    });

  } catch (error) {
    console.error('Migration failed:', error.message);
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Note: Column already exists, skipping...');
    } else {
      throw error;
    }
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released.');
    }
    process.exit(0);
  }
}

runMigration().catch(error => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
