require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function updateDatabase() {
  let connection;

  try {
    console.log('Connecting to database...');

    // Database configuration - you may need to set these environment variables
    const dbConfig = {
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'jobspark',
      multipleStatements: true // Allow multiple SQL statements in one query
    };

    console.log(`Connecting to MySQL database: ${dbConfig.database} on ${dbConfig.host}`);

    connection = await mysql.createConnection(dbConfig);

    console.log('Connected successfully!');

    // Read the SQL dump file
    const dumpPath = path.join(__dirname, 'database_dump.sql');
    const sqlDump = fs.readFileSync(dumpPath, 'utf8');

    console.log('Executing database dump...');

    // Execute the entire dump at once using query instead of execute
    // This allows multiple statements and MySQL-specific commands
    await connection.query(sqlDump);

    console.log('Database updated successfully!');

    // Verify some tables exist
    console.log('Verifying database structure...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tables in database:', tables.map(row => Object.values(row)[0]).join(', '));

    // Show count of records in key tables
    const tablesToCheck = ['users', 'admins', 'jobs', 'job_applications'];
    for (const table of tablesToCheck) {
      try {
        const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`Records in ${table}: ${countResult[0].count}`);
      } catch (error) {
        console.log(`Could not count records in ${table}: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('Database update failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }

    if (error.code === 'ECONNREFUSED') {
      console.log('\nTroubleshooting:');
      console.log('1. Make sure MySQL server is running');
      console.log('2. Check your database credentials');
      console.log('3. Verify the database exists');
      console.log('4. You may need to create a .env file with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\nDatabase does not exist. You need to create it first:');
      console.log('CREATE DATABASE jobspark;');
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('Warning: No .env file found. Please create one with your database credentials:');
  console.log('DB_HOST=127.0.0.1');
  console.log('DB_USER=root');
  console.log('DB_PASSWORD=your_password');
  console.log('DB_NAME=jobspark');
  console.log('');
  console.log('Example .env file content:');
  console.log('DB_HOST=127.0.0.1\nDB_USER=root\nDB_PASSWORD=\nDB_NAME=jobspark');
  console.log('');
}

updateDatabase().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
