import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Match order with Supabase Auth demo users
const demoProfiles = [
  {
    name: 'Serena Williams',
    skill_level: 5,
    email: 'serena@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Serena',
  },
  {
    name: 'Roger Federer',
    skill_level: 5,
    email: 'roger@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Roger',
  },
  {
    name: 'Naomi Osaka',
    skill_level: 4,
    email: 'naomi@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Naomi',
  },
  {
    name: 'Novak Djokovic',
    skill_level: 5,
    email: 'novak@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Novak',
  },
  {
    name: 'Coco Gauff',
    skill_level: 3,
    email: 'coco@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Coco',
  },
  {
    name: 'Carlos Alcaraz',
    skill_level: 4,
    email: 'carlos@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Carlos',
  },
];

async function main() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('❌ Failed to list users:', error.message);
    process.exit(1);
  }

  const inserts = demoProfiles.map((profile, i) => {
    const user = users.users[i];
    if (!user) {
      console.error(`⚠️ No auth user for ${profile.name}`);
      return null;
    }

    return {
      id: user.id,
      name: profile.name,
      email: profile.email,
      skill_level: profile.skill_level,
      avatar_url: profile.avatar_url,
      created_at: new Date().toISOString(),
    };
  }).filter(Boolean);

  const { error: upsertError } = await supabase.from('profiles').upsert(inserts);
  if (upsertError) {
    console.error('❌ Failed to upsert profiles:', upsertError.message);
  } else {
    console.log('✅ Demo profiles seeded successfully.');
  }
}

main();

