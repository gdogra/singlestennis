// scripts/seed‑demo‑auth.js
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

// This client uses your service_role key so it can bypass RLS
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DEMO_USERS = [
  { email: 'test@example.com',  password: 'Password123!', name: 'Test User',  skill: '3.6' },
  { email: 'alice@example.com', password: 'Password123!', name: 'Alice',      skill: '4.0' },
  { email: 'bob@example.com',   password: 'Password123!', name: 'Bob',        skill: '4.5' },
  { email: 'carol@example.com', password: 'Password123!', name: 'Carol',      skill: '5.0' },
  { email: 'dave@example.com',  password: 'Password123!', name: 'Dave',       skill: '6.0' },
];

async function upsertDemoUsers() {
  for (let u of DEMO_USERS) {
    // 1) create auth user if not exist
    const { data: existing, error: fetchErr } = await supabaseAdmin.auth.admin.listUsers({
      filter: `email.eq.${u.email}`
    });
    if (fetchErr) {
      console.error(`✗ fetch error for ${u.email}:`, fetchErr.message);
      continue;
    }
    let uid;
    if (existing.length) {
      uid = existing[0].id;
      console.log(`→ user exists: ${u.email} (uid=${uid})`);
      // reset password just in case
      await supabaseAdmin.auth.admin.updateUserById(uid, { password: u.password });
      console.log(`  • password reset`);
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email:    u.email,
        password: u.password,
        email_confirm: true
      });
      if (createErr) {
        console.error(`✗ createUser ${u.email}:`, createErr.message);
        continue;
      }
      uid = created.id;
      console.log(`✓ created auth.user ${u.email} (uid=${uid})`);
    }

    // 2) upsert into public.profiles
    const { error: upsertErr } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id:         uid,
        name:       u.name,
        avatar_url: null,
        skill_level: u.skill,
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });
    if (upsertErr) {
      console.error(`✗ upsert profile ${u.email}:`, upsertErr.message);
    } else {
      console.log(`✓ upserted profile for ${u.name} (${u.skill})`);
    }
  }
}

upsertDemoUsers()
  .then(() => console.log('\nAll done — now run your SQL seed for matches & requests!'))
  .catch(console.error);

