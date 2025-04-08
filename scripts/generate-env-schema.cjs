// scripts/generate-env-schema.cjs
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const rootDir = path.resolve(__dirname, '..'); // monorepo root

const targets = [
  {
    env: path.join(rootDir, 'frontend/.env'),
    schema: path.join(rootDir, '.env.schema.frontend.json'),
    label: 'frontend',
  },
  {
    env: path.join(rootDir, 'backend/.env'),
    schema: path.join(rootDir, '.env.schema.backend.json'),
    label: 'backend',
  },
];

// ✅ Accurate type inference
const inferType = (val) => {
  const v = val.trim();
  if (v === 'true' || v === 'false') return 'boolean';
  if (/^-?\d+(\.\d+)?$/.test(v)) return 'number'; // strictly numeric
  return 'string';
};

for (const { env, schema, label } of targets) {
  if (!fs.existsSync(env)) {
    console.error(`❌ ${label}: .env file not found at ${env}`);
    continue;
  }

  const parsed = dotenv.parse(fs.readFileSync(env, 'utf-8'));
  const output = {};

  for (const [key, value] of Object.entries(parsed)) {
    output[key] = inferType(value);
  }

  fs.writeFileSync(schema, JSON.stringify(output, null, 2) + '\n');
  console.log(`✅ ${label} schema written to ${path.basename(schema)}`);
}

