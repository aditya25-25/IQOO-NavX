import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    '[IQOO NavX] Supabase environment variables are missing (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY). Operating in local offline-only mode.'
  );
}

// Centrally initialized Supabase client singleton
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
