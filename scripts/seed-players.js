// scripts/seed-players.js
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getUserIdByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers({
    filter: `email=eq.${email}`,
    perPage: 1,
  })
  if (error) throw error
  if (!data.users.length) throw new Error(`no user found for ${email}`)
  return data.users[0].id
}

async function seedUsers() {
  const players = [
    { email: 'alice@example.com', name: 'Alice', skill: '3.6' },
    { email: 'bob@example.com',   name: 'Bob',   skill: '4.0' },
    { email: 'carol@example.com', name: 'Carol', skill: '4.5' },
  ]

  for (let p of players) {
    // 1) create the Auth user (idempotent)
    const { data: u, error: ue } = await supabase.auth.admin.createUser({
      email:         p.email,
      password:      'password123',
      email_confirm: true,
    })

    if (ue) {
      // if it's *not* an "already registered" message, bail out
      const msg = ue.message.toLowerCase()
      if (!msg.includes('already') || !msg.includes('email')) {
        console.error('✗ createUser', p.email, ue.message)
        continue
      }
      // otherwise it's fine—user existed already
    }

    // 2) fetch their actual user ID
    let userId
    try {
      userId = await getUserIdByEmail(p.email)
    } catch (e) {
      console.error('✗ fetchUserId', p.email, e.message)
      continue
    }

    // 3) upsert their profile row
    const { error: pe } = await supabase
      .from('profiles')
      .upsert({
        id:           userId,
        name:         p.name,
        avatar_url:  null,
        skill_level: p.skill,
      })
    if (pe) console.error('✗ upsert profile', p.email, pe.message)
    else    console.log('✔ seeded', p.email, p.name, p.skill)
  }
}

seedUsers()
  .catch(console.error)
  .finally(() => process.exit())

