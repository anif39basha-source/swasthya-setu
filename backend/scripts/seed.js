// Quick seed script - run with: node scripts/seed.js
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('This script requires a PostgreSQL database connection.');
  console.log('Please ensure your .env file is configured with DATABASE_URL.');
  console.log('');
  console.log('The schema.sql file in /database contains all tables.');
  console.log('For demo data, connect to PostgreSQL and run the seed commands from schema.sql');
}

seed().catch(console.error);