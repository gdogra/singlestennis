// scripts/seed-challenges.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const challenges = [
  {
    sender: 'alice@example.com',
    receiver: 'bob@example.com',
    message: 'Ready for a rematch?',
  },
  {
    sender: 'carol@example.com',
    receiver: 'dave@example.com',
    message: 'Up for a challenge?',
  },
];

for (const challenge of challenges) {
  const [s, r] = await Promise.all([
    supabase.from('users').select('id').eq('email', challenge.sender).maybeSingle(),
    supabase.from('users').select('id').eq('email', challenge.receiver).maybeSingle(),
  ]);

  if (!s.data || !r.data) {
    console.error(`❌ Could not find user(s) for challenge from ${challenge.sender}`);
    continue;
  }

  const { error } = await supabase.from('challenges').insert({
    sender_id: s.data.id,
    receiver_id: r.data.id,
    status: 'pending',
    message: challenge.message,
  });

  if (error) {
    console.error(`❌ Challenge insert failed: ${error.message}`);
  } else {
    console.log(`✅ Challenge inserted from ${challenge.message}`);
  }
}

console.log('🎯 Done seeding challenges');

