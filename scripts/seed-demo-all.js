#!/usr/bin/env node

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const steps = [
  {
    name: 'Upsert users from auth',
    script: 'upsert-users-from-auth.mjs',
  },
  {
    name: 'Insert demo profiles',
    script: 'seed-demo-profiles.mjs',
  },
  {
    name: 'Seed matches',
    script: 'seed-matches.js',
  },
  {
    name: 'Seed challenges',
    script: 'seed-challenges.js',
  },
  {
    name: 'Seed avatars',
    script: 'seed-avatars.js',
  },
];

const runScript = (label, file) => {
  try {
    console.log(`\n🔧 ${label}...`);
    execSync(`node ${path.join(__dirname, file)}`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`❌ Failed during ${label}:\n`, err.message);
  }
};

for (const step of steps) {
  runScript(step.name, step.script);
}

console.log('\n🎉 Demo seeding complete!');

