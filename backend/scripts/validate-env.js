// backend/scripts/validate-env.js
const requiredVars = [
  'DATABASE_URL',
  'DB_SSL',
  'JWT_SECRET',
  'PORT'
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables:\n${missing.join('\n')}`);
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set.');
}

