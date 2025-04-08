// backend/scripts/validate-env.cjs
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const requiredVars = ['DATABASE_URL', 'DB_SSL', 'JWT_SECRET', 'PORT'];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables:\n${missing.join('\n')}`);
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set.');
}

