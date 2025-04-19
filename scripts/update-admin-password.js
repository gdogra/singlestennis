// scripts/update-admin-password.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Replace with your real admin Auth UUID
const ADMIN_USER_ID = 'e83ffdf2-f94a-479b-baaa-bae56bf1d16d'
const NEW_PASSWORD   = 'admin123'

async function resetPassword() {
  // ← use updateUserById, not updateUser
  const { data, error } = await supabase.auth.admin.updateUserById(
    ADMIN_USER_ID,
    { password: NEW_PASSWORD, email_confirm: true }
  )

  if (error) {
    console.error('❌ Failed to update password:', error)
    process.exit(1)
  }
  console.log(`✅ Password reset for user ${data.id}`)
  process.exit(0)
}

resetPassword()

