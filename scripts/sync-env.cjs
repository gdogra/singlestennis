// scripts/sync-env.cjs
const fs = require('fs');
const path = require('path');

const targets = [
  {
    label: 'frontend',
    env: path.resolve(__dirname, '../frontend/.env'),
    example: path.resolve(__dirname, '../frontend/.env.example'),
  },
  {
    label: 'backend',
    env: path.resolve(__dirname, '../backend/.env'),
    example: path.resolve(__dirname, '../backend/.env.example'),
  },
];

for (const { label, env, example } of targets) {
  if (fs.existsSync(env)) {
    console.log(`✅ ${label}: .env already exists`);
    continue;
  }

  if (!fs.existsSync(example)) {
    console.warn(`⚠️  ${label}: .env.example not found`);
    continue;
  }

  fs.copyFileSync(example, env);
  console.log(`✅ ${label}: .env created from .env.example`);
}

