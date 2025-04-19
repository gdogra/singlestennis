// scripts/seed-demo-auth.cjs
const dotenv = require('dotenv')
const { createClient } = require('@supabase/supabase-js')
dotenv.config()

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function resetPassword(email, newPassword) {
  // 1) find the user via listUsers
  const { data, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
    filter: `email=eq.${email}`
  })
  if (listErr) throw listErr
  const user = data.users?.[0]
  if (!user) throw new Error(`No auth user found for ${email}`)

  // 2) update their password & mark email confirmed
  const { data: upd, error: updErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: newPassword,
    email_confirm: true
  })
  if (updErr) throw updErr

  console.log(`🔑 Reset password for ${email}`)
}

;(async () => {
  const DEMO = [
    'test@example.com',
    'alice@example.com',
    'bob@example.com',
    'carol@example.com',
    'dave@example.com',
  ]

  for (const email of DEMO) {
    await resetPassword(email, 'admin123')
  }
  console.log('✅ All demo passwords reset!')
})()

