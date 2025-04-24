import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const DEFAULT_AVATARS = [
  'tennis/serena',
  'tennis/rafa',
  'tennis/iga',
  'tennis/federer',
  'tennis/djokovic',
  'tennis/sinner',
  'tennis/alcaraz',
  'tennis/osaka',
]

function pickRandomAvatar() {
  const index = Math.floor(Math.random() * DEFAULT_AVATARS.length)
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${DEFAULT_AVATARS[index]}.jpg`
}

async function assignAvatars() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')

  if (error) {
    console.error('❌ Failed to fetch profiles:', error.message)
    return
  }

  let updated = 0

  for (const profile of profiles) {
    if (profile.avatar_url) {
      console.log(`✅ Skipped: ${profile.name} (already has avatar)`)
      continue
    }

    const avatarUrl = pickRandomAvatar()

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', profile.id)

    if (updateError) {
      console.error(`❌ Failed to update avatar for ${profile.name}:`, updateError.message)
    } else {
      console.log(`🎾 Assigned avatar to ${profile.name}`)
      updated++
    }
  }

  console.log(`\n✨ Avatars updated: ${updated}`)
}

assignAvatars()

