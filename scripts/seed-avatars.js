// scripts/seed-avatars.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const avatarMap = {
  'alice@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713483770/alice.jpg',
  'bob@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713483770/bob.jpg',
  'carol@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713483770/carol.jpg',
  'dave@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713483770/dave.jpg',
  'test@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713483770/test.jpg',
  'admin@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713483770/admin.jpg',
};

for (const [email, url] of Object.entries(avatarMap)) {
  const { data: users, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (error || !users) {
    console.error(`❌ User not found for ${email}`);
    continue;
  }

  const { error: avatarErr } = await supabase
    .from('profiles')
    .update({ avatar_url: url })
    .eq('id', users.id);

  if (avatarErr) {
    console.error(`❌ Failed to update avatar for ${email}:`, avatarErr.message);
  } else {
    console.log(`🖼️  Avatar updated for ${email}`);
  }
}

console.log('🖼️  Done assigning fallback avatars!');

