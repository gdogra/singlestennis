import 'dotenv/config';
import { supabase } from './_client.mjs';

const avatarMap = {
  'alice@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713540001/alice.jpg',
  'bob@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713540001/bob.jpg',
  'carol@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713540001/carol.jpg',
  'dave@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713540001/dave.jpg',
  'test@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713540001/test.jpg',
  'admin@example.com': 'https://res.cloudinary.com/deonkhpgh/image/upload/v1713540001/admin.jpg',
};

async function seedAvatars() {
  for (const [email, avatar_url] of Object.entries(avatarMap)) {
    const { data: profile, error: fetchErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (fetchErr || !profile) {
      console.error(`❌ Profile not found for ${email}:`, fetchErr?.message);
      continue;
    }

    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ avatar_url })
      .eq('id', profile.id);

    if (updateErr) {
      console.error(`❌ Failed to update avatar for ${email}:`, updateErr.message);
    } else {
      console.log(`✅ Updated avatar for ${email}`);
    }
  }

  console.log('📸 Avatar seeding complete!');
}

seedAvatars();

