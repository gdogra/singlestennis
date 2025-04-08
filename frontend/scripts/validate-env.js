// frontend/scripts/validate-env.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const requiredVars = ['VITE_API_BASE_URL', 'VITE_GOOGLE_CLIENT_ID'];

const loadEnvFile = (file) => {
  const fullPath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath });
    console.log(`✅ Loaded environment variables from ${file}`);
    return true;
  }
  return false;
};

const NODE_ENV = process.env.NODE_ENV || 'development';

const envFiles = [
  '.env.local',
  `.env.${NODE_ENV}.local`,
  `.env.${NODE_ENV}`,
  '.env',
];

let loaded = false;
for (const file of envFiles) {
  if (loadEnvFile(file)) {
    loaded = true;
    break;
  }
}

if (!loaded) {
  console.warn('⚠️  No .env files found. Proceeding with system env only.');
}

// Validation
const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables:\n${missing.join('\n')}`);
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set.');
}

