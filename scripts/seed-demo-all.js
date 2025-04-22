import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const DEMO_USERS = [
  { email: 'demo@domain.com', name: 'Gautam Dogra' },
  { email: 'serena@singlestennis.com', name: 'Serena Williams' },
  { email: 'rafa@singlestennis.com', name: 'Rafael Nadal' },
  { email: 'iga@singlestennis.com', name: 'Iga Swiatek' },
]

async function seedDemoUsers() {
  console.log('⏳ Seeding demo users...')

  for (const { email, name } of DEMO_USERS) {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      console.log(`✅ Already exists: ${email}`)
      continue
    }

    const userRes = await supabase.auth.admin.createUser({
      email,
      password: 'secret-password',
      email_confirm: true,
    })

    if (userRes.error) {
      console.warn(`⚠️ Failed to create ${email}: ${userRes.error.message}`)
      continue
    }

    const { id } = userRes.data.user

    const profileRes = await supabase
      .from('profiles')
      .upsert(
        { id, email, name },
        { onConflict: 'id' }
      )

    if (profileRes.error) {
      console.warn(`⚠️ Failed to upsert profile for ${email}: ${profileRes.error.message}`)
    } else {
      console.log(`✅ Created: ${email}`)
    }
  }

  console.log('✨ Done seeding users and profiles.')
}

seedDemoUsers()

