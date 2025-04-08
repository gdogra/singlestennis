// backend/scripts/init-env.cjs
const fs = require('fs');
const path = require('path');

const envExample = path.resolve(__dirname, '..', '.env.example');
const env = path.resolve(__dirname, '..', '.env');

if (fs.existsSync(env)) {
  console.log('✅ .env already exists');
  process.exit(0);
}

if (!fs.existsSync(envExample)) {
  console.error('❌ .env.example not found');
  process.exit(1);
}

fs.copyFileSync(envExample, env);
console.log('✅ .env created from .env.example');

