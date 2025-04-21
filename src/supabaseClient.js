// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

/**
 * Initialize Supabase client using env vars.
 * Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env.
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

