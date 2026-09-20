import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check if valid Supabase credentials are configured
export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  typeof rawUrl === 'string' &&
  typeof rawKey === 'string' &&
  rawUrl.trim().startsWith('http') &&
  rawKey.trim().length > 10
);

const supabaseUrl = isSupabaseConfigured ? rawUrl!.trim() : 'https://placeholder.supabase.co';
const supabasePublishableKey = isSupabaseConfigured ? rawKey!.trim() : 'placeholder-anon-key';

if (!isSupabaseConfigured) {
  console.info(
    '[IQOO NavX] Supabase environment variables not detected or invalid. Operating in 100% offline-first mode.'
  );
}

// Centrally initialized Supabase client singleton with safe fallback
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
      detectSessionInUrl: isSupabaseConfigured,
    },
  }
);
