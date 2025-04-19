// scripts/seed-admin.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Use your public URL + the service role key
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'StrongP@ssw0rd!'

async function seed() {
  // 1) Create the Auth user
  const { data: user, error: userErr } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true
  })

  if (userErr) {
    console.error('Error creating auth user:', userErr)
    process.exit(1)
  }
  console.log('✅ Auth user created:', user.user.id)

  // 2) Upsert into your public.users table with role = 'admin'
  const { error: profileErr } = await supabase
    .from('users')
    .upsert({
      id: user.user.id,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,      // only if you need it here
      role: 'admin',
      created_at: new Date().toISOString()
    }, { onConflict: 'id' })

  if (profileErr) {
    console.error('Error inserting into public.users:', profileErr)
    process.exit(1)
  }
  console.log('✅ public.users row created/updated with role=admin')
  process.exit(0)
}

seed()

