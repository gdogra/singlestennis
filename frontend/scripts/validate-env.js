// frontend/scripts/validate-env.js

const requiredVars = ['VITE_API_BASE_URL'];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables:\n${missing.join('\n')}`);
  process.exit(1);
} else {
  console.log('✅ All required frontend env variables are set.');
}

