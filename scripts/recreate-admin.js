// scripts/recreate-admin.js
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

dotenv.config()

const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'admin123'

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

async function recreateAdmin() {
  // 1) See if a user already exists in auth.users
  const { data: listResp, error: listErr } = 
    await supabaseAdmin.auth.admin.listUsers({ perPage: 100 }) 
  if (listErr) throw listErr

  // find by email
  const existing = listResp.users.find(u => u.email === ADMIN_EMAIL)
  let userId

  if (existing) {
    userId = existing.id
    console.log(`✅ Found existing user ${ADMIN_EMAIL} (${userId}), resetting password…`)
    const { data, error: updErr } = 
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD
      })
    if (updErr) throw updErr
  } else {
    console.log(`ℹ️  No admin found, creating ${ADMIN_EMAIL}…`)
    const { data, error: createErr } = 
      await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true
      })
    if (createErr) throw createErr
    userId = data.user.id
    console.log(`✅ Created admin (${userId})`)
  }

  // 2) Upsert into public.users with the bcrypt‐hashed password + role
  const hashed = bcrypt.hashSync(ADMIN_PASSWORD, 10)
  const { error: upsertErr } = 
    await supabaseAdmin
      .from('users')
      .upsert({ id: userId, email: ADMIN_EMAIL, password: hashed, role: 'admin' })
  if (upsertErr) throw upsertErr

  console.log(`✅ public.users upsert OK for ${ADMIN_EMAIL}`)
}

recreateAdmin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Failed:', err)
    process.exit(1)
  })

