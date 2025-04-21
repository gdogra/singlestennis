// File: scripts/seed-demo.js
// A Node script to seed Supabase tables: profiles, matches, challenges, accepts

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role key needed for upserts
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function upsertProfiles() {
  const profiles = [
    { id: 'user-1-uuid', name: 'Alice', avatar_url: 'https://...', skill_level: 4 },
    { id: 'user-2-uuid', name: 'Bob', avatar_url: 'https://...', skill_level: 5 },
    // add more
  ];
  const { data, error } = await supabase.from('profiles').upsert(profiles);
  if (error) throw error;
  console.log('Profiles upserted:', data.length);
}

async function insertMatches() {
  const matches = [
    { id: 1, player1_id: 'user-1-uuid', player2_id: 'user-2-uuid', winner_id: 'user-2-uuid', played_at: '2025-04-20' },
    // more matches...
  ];
  const { data, error } = await supabase.from('matches').insert(matches);
  if (error) throw error;
  console.log('Matches inserted:', data.length);
}

async function insertChallenges() {
  const challenges = [
    { id: 1, sender_id: 'user-1-uuid', receiver_id: 'user-2-uuid', message: 'Let’s play!', scheduled_for: '2025-04-25' },
    // ...
  ];
  const { data, error } = await supabase.from('challenges').insert(challenges);
  if (error) throw error;
  console.log('Challenges inserted:', data.length);
}

async function insertAccepts() {
  const accepts = [
    { id: 1, challenge_id: 1, accepted_at: new Date().toISOString() },
    // ...
  ];
  const { data, error } = await supabase.from('accepts').insert(accepts);
  if (error) throw error;
  console.log('Accepts inserted:', data.length);
}

async function seedAll() {
  try {
    await upsertProfiles();
    await insertMatches();
    await insertChallenges();
    await insertAccepts();
    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

seedAll();

