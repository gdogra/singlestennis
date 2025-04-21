#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const demoProfiles = [
  {
    email: 'alice@example.com',
    name: 'Alice',
    full_name: 'Alice Wonderland',
    skill_level: 5,
  },
  {
    email: 'bob@example.com',
    name: 'Bob',
    full_name: 'Bob Builder',
    skill_level: 4,
  },
  {
    email: 'carol@example.com',
    name: 'Carol',
    full_name: 'Carol Danvers',
    skill_level: 3,
  },
  {
    email: 'dave@example.com',
    name: 'Dave',
    full_name: 'Dave Grohl',
    skill_level: 5,
  },
  {
    email: 'test@example.com',
    name: 'Test',
    full_name: 'Test User',
    skill_level: 3,
  },
  {
    email: 'admin@example.com',
    name: 'Admin',
    full_name: 'Admin User',
    skill_level: 4,
  },
];

console.log('\n🎾 Inserting demo profiles...');

for (const profile of demoProfiles) {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', profile.email)
    .single();

  if (userError || !user) {
    console.error(`❌ User not found for ${profile.email}`);
    continue;
  }

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      name: profile.name,
      full_name: profile.full_name,
      skill_level: profile.skill_level,
    });

  if (upsertError) {
    console.error(`❌ Failed to upsert ${profile.name}`, upsertError.message);
  } else {
    console.log(`✅ Upserted profile for ${profile.name}`);
  }
}

console.log('🎾 Done inserting demo profiles!');

