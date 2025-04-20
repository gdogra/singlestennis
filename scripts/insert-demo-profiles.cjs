// scripts/insert-demo-profiles.cjs
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const demoProfiles = [
  { email: 'alice@example.com', name: 'Alice', skill_level: 3.6 },
  { email: 'bob@example.com', name: 'Bob', skill_level: 4.0 },
  { email: 'carol@example.com', name: 'Carol', skill_level: 4.5 },
  { email: 'dave@example.com', name: 'Dave', skill_level: 5.0 },
  { email: 'test@example.com', name: 'Test User', skill_level: 3.6 },
  { email: 'admin@example.com', name: 'Admin User', skill_level: 5.0 },
];

async function insertProfiles() {
  for (const profile of demoProfiles) {
    const { data, error: userErr } = await supabase.auth.admin.getUserByEmail(profile.email);

    const user = data?.user;

    if (userErr || !user) {
      console.error(`❌ Could not find auth.user for ${profile.email}`, userErr?.message);
      continue;
    }

    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: user.id,
      name: profile.name,
      skill_level: profile.skill_level,
    });

    if (profileErr) {
      console.error(`❌ Failed to insert profile for ${profile.email}:`, profileErr.message);
    } else {
      console.log(`✅ Profile inserted for ${profile.email}`);
    }
  }

  console.log('🎾 Done inserting demo profiles!');
}

insertProfiles();

