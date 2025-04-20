import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const upsertUsers = async () => {
  const { data: authUsers, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Failed to fetch auth users:', error.message);
    return;
  }

  for (const user of authUsers.users) {
    const { id, email } = user;
    const { error: insertErr } = await supabase
      .from('users')
      .upsert({ id, email });

    if (insertErr) {
      console.error(`❌ Failed to insert user ${email}:`, insertErr.message);
    } else {
      console.log(`✅ Upserted user: ${email}`);
    }
  }

  console.log('📥 Done upserting users from Supabase Auth');
};

await upsertUsers();

