const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../.env.production')
    : path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

// Define required environment variables
const requiredVars = ['VITE_API_BASE_URL'];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach((key) => console.error(key));
  process.exit(1);
}

console.log('✅ Environment variables validated.');

