// scripts/list-users.cjs
const dotenv = require('dotenv');
dotenv.config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return console.error('❌ Error:', error);

  for (const user of data.users) {
    console.log(`🧑‍💻 ${user.email} (${user.id})`);
  }
})();

