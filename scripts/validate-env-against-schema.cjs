// scripts/validate-env-against-schema.cjs
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Read CLI args
const [,, schemaArg, envArg] = process.argv.slice(2);

// Defaults
const defaultSchemas = {
  frontend: '../.env.schema.frontend.json',
  backend: '../.env.schema.backend.json',
};

const defaultEnvs = {
  frontend: '../frontend/.env',
  backend: '../backend/.env',
};

const validateEnv = (envPath, schemaPath, label) => {
  console.log(`🔍 Validating ${label}...`);

  if (!fs.existsSync(envPath)) {
    console.error(`❌ ${label} .env file not found: ${envPath}`);
    return false;
  }

  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ ${label} schema file not found: ${schemaPath}`);
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

// Use custom paths or run both frontend/backend
if (schemaArg && envArg) {
  const label = envArg.includes('frontend') ? 'frontend' : 'backend';
  const ok = validateEnv(envArg, schemaArg, label);
  if (!ok) process.exit(1);
} else {
  const frontendOk = validateEnv(
    path.resolve(__dirname, defaultEnvs.frontend),
    path.resolve(__dirname, defaultSchemas.frontend),
    'frontend'
  );
  const backendOk = validateEnv(
    path.resolve(__dirname, defaultEnvs.backend),
    path.resolve(__dirname, defaultSchemas.backend),
    'backend'
  );
  if (!frontendOk || !backendOk) process.exit(1);
}

