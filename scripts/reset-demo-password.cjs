// scripts/reset-demo-password.cjs
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const EMAIL = 'test@example.com';
const NEW_PASSWORD = 'admin123';

async function resetPassword() {
  const { data: userData, error: lookupErr } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  if (lookupErr) {
    console.error('❌ Failed to list users:', lookupErr.message);
    return;
  }

  const user = userData.users.find((u) => u.email === EMAIL);

  if (!user) {
    console.error(`❌ No user found with email: ${EMAIL}`);
    return;
  }

  const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: NEW_PASSWORD,
  });

  if (updateErr) {
    console.error(`❌ Failed to update password:`, updateErr.message);
  } else {
    console.log(`✅ Password updated for ${EMAIL}`);
  }
}

resetPassword();

