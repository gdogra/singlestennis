// scripts/seed-matches.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const seedMatches = async () => {
  const { data: profiles, error } = await supabase.from('profiles').select('id, name');
  if (error) throw new Error(`❌ Error fetching profiles: ${error.message}`);

  const profileMap = Object.fromEntries(profiles.map(p => [p.name, p.id]));

  const matches = [
    {
      winner_id: profileMap['Test User'],
      loser_id: profileMap['Alice'],
      court: 'Court 1',
      score: '6-4, 6-3',
      status: 'completed'
    },
    {
      winner_id: profileMap['Bob'],
      loser_id: profileMap['Test User'],
      court: 'Court 2',
      score: '7-5, 3-6, 6-4',
      status: 'completed'
    },
    {
      winner_id: profileMap['Test User'],
      loser_id: profileMap['Carol'],
      court: 'Court 3',
      score: '6-3, 6-1',
      status: 'completed'
    }
  ];

  for (const match of matches) {
    const { error } = await supabase.from('matches').insert({ id: uuidv4(), ...match });
    if (error) console.error(`❌ Failed to insert match:`, error.message);
    else console.log(`✅ Match inserted: ${match.court}`);
  }

  console.log('🎾 Done seeding matches');
};

seedMatches();

