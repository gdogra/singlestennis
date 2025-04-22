// scripts/seed.cjs
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
dotenv.config()

// full‑privilege client (service role)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

async function seed() {
  const demoUsers = [
    { email: 'alice@example.com', password: 'password', name: 'Alice', avatar_url: 'https://i.pravatar.cc/150?img=1', skill_level: 4 },
    { email: 'bob@example.com',   password: 'password', name: 'Bob',   avatar_url: 'https://i.pravatar.cc/150?img=2', skill_level: 5 },
    { email: 'test@example.com',  password: 'password', name: 'Test',  avatar_url: 'https://i.pravatar.cc/150?img=3', skill_level: 3 },
    { email: 'demo@domain.com',   password: 'secret-password', name: 'Demo',  avatar_url: 'https://i.pravatar.cc/150?img=4', skill_level: 3 },
  ]
  const demoEmails = demoUsers.map((u) => u.email)

  console.log('🧹 Deleting existing demo auth users if any…')
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers()
  if (listErr) throw listErr

  for (const u of users.filter((u) => demoEmails.includes(u.email))) {
    console.log(`  ↳ deleting user ${u.email}`)
    const { error: delErr } = await supabase.auth.admin.deleteUser(u.id)
    if (delErr) throw delErr
  }

  console.log('🧹 Cleaning up old demo table data…')
  await supabase.from('accepts'   ).delete().neq('challenge_id', '')
  await supabase.from('challenges').delete().neq('id',           '')
  await supabase.from('matches'   ).delete().neq('id',           '')
  await supabase.from('profiles'  ).delete().neq('id',           '')

  console.log('👥 Seeding profiles (and users)…')
  const profileIds = {}
  for (const u of demoUsers) {
    const { data: { user }, error: authErr } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    })
    if (authErr) throw authErr

    // 🔐 Force confirm
    await supabase.auth.admin.updateUserById(user.id, {
      email_confirmed_at: new Date().toISOString(),
    })

    const { error: profErr } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        name: u.name,
        avatar_url: u.avatar_url,
        skill_level: u.skill_level,
      })
    if (profErr) throw profErr

    profileIds[u.name] = user.id
  }

  console.log('🎾 Seeding matches…')
  const matchesData = [
    {
      id: crypto.randomUUID(),
      player1_id: profileIds.Alice,
      player2_id: profileIds.Bob,
      winner_id:  profileIds.Bob,
      played_at:  '2025-04-19T17:00:00Z',
    },
    {
      id: crypto.randomUUID(),
      player1_id: profileIds.Test,
      player2_id: profileIds.Alice,
      winner_id:  profileIds.Test,
      played_at:  '2025-04-20T18:30:00Z',
    },
  ]
  const { error: matchErr } = await supabase.from('matches').insert(matchesData)
  if (matchErr) throw matchErr

  console.log('📨 Seeding challenges…')
  const challengesData = [
    {
      id: crypto.randomUUID(),
      challenger_id: profileIds.Alice,
      opponent_id: profileIds.Bob,
      message: 'Up for a match next weekend?',
      status: 'pending',
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      challenger_id: profileIds.Bob,
      opponent_id: profileIds.Alice,
      message: 'Sounds good—see you then!',
      status: 'pending',
      created_at: new Date().toISOString(),
    },
  ]
  const { error: challErr } = await supabase.from('challenges').insert(challengesData)
  if (challErr) throw challErr

  console.log('✅ Done seeding demo data!')
}

seed().catch((err) => {
  console.error('Seeding error:', err)
  process.exit(1)
})

