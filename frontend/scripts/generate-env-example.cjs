// scripts/generate-env-example.cjs
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const examplePath = path.resolve(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf-8');

const exampleContent = content
  .split('\n')
  .map((line) => {
    if (line.trim().startsWith('#') || line.trim() === '') {
      return line;
    }
    const key = line.split('=')[0];
    return `${key}=`;
  })
  .join('\n');

fs.writeFileSync(examplePath, exampleContent);
console.log('✅ .env.example generated');

