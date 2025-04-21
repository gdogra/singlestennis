// scripts/seed-matches.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const matches = [
  {
    player1: 'alice@example.com',
    player2: 'bob@example.com',
    score: '6-3, 6-4',
    winner: 'alice@example.com',
    location: 'Court 1',
  },
  {
    player1: 'carol@example.com',
    player2: 'dave@example.com',
    score: '4-6, 6-1, 7-5',
    winner: 'carol@example.com',
    location: 'Court 2',
  },
];

for (const match of matches) {
  const [p1, p2, win] = await Promise.all([
    supabase.from('users').select('id').eq('email', match.player1).maybeSingle(),
    supabase.from('users').select('id').eq('email', match.player2).maybeSingle(),
    supabase.from('users').select('id').eq('email', match.winner).maybeSingle(),
  ]);

  if (!p1.data || !p2.data || !win.data) {
    console.error(`❌ Failed to find one or more players for match at ${match.location}`);
    continue;
  }

  const { error } = await supabase.from('matches').insert({
    player1_id: p1.data.id,
    player2_id: p2.data.id,
    winner_id: win.data.id,
    score: match.score,
    location: match.location,
    played_at: new Date().toISOString(),
  });

  if (error) {
    console.error(`❌ Failed to insert match: ${error.message}`);
  } else {
    console.log(`✅ Match inserted: ${match.location}`);
  }
}

console.log('🎾 Done seeding matches');

