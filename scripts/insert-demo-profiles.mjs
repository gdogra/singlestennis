// scripts/insert-demo-profiles.mjs
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const defaultSkillLevel = 3;
const defaultAvatarUrl = '';

async function insertProfiles() {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Failed to fetch users from Supabase Auth:', error.message);
    process.exit(1);
  }

  for (const user of data.users) {
    const { id, email } = user;

    const full_name = email?.split('@')[0]
      ?.replace(/(^\w|\s\w)/g, c => c.toUpperCase())
      .replace('.', ' ') || 'Unnamed';

    const { error: insertErr } = await supabase.from('profiles').upsert({
      id,
      full_name,
      avatar_url: defaultAvatarUrl,
      skill_level: defaultSkillLevel
    });

    if (insertErr) {
      console.error(`❌ Failed to insert profile for ${email}:`, insertErr.message);
    } else {
      console.log(`✅ Inserted profile for ${email}`);
    }
  }

  console.log('🎾 Done inserting demo profiles!');
}

insertProfiles();

