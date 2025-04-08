// scripts/validate-env-against-schema.cjs
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const schemaPath = path.resolve(__dirname, '../.env.schema.json');
const frontendEnvPath = path.resolve(__dirname, '../frontend/.env');
const backendEnvPath = path.resolve(__dirname, '../backend/.env');

const validateEnv = (envPath, label) => {
  console.log(`🔍 Validating ${label}...`);

  if (!fs.existsSync(envPath)) {
    console.error(`❌ ${label} .env file not found: ${envPath}`);
    return false;
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const parsed = dotenv.parse(envContent);

  let allGood = true;

  for (const [key, type] of Object.entries(schema)) {
    if (!(key in parsed)) {
      console.error(`❌ ${label}: Missing ${key}`);
      allGood = false;
    } else {
      const raw = parsed[key];
      if (type === 'number' && isNaN(Number(raw))) {
        console.error(`❌ ${label}: ${key} should be a number`);
        allGood = false;
      }
      if (type === 'boolean' && !['true', 'false'].includes(raw.toLowerCase())) {
        console.error(`❌ ${label}: ${key} should be a boolean`);
        allGood = false;
      }
    }
  }

  if (allGood) {
    console.log(`✅ ${label}: All environment variables are valid.`);
  }

  return allGood;
};

const frontendOk = validateEnv(frontendEnvPath, 'frontend');
const backendOk = validateEnv(backendEnvPath, 'backend');

if (!frontendOk || !backendOk) {
  process.exit(1);
}

