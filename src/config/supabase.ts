import { createClient, SupabaseClient } from '@supabase/supabase-js';

function createClientOptional() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function getSupabase(): SupabaseClient {
  const client = createClientOptional();
  if (!client) {
    throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY devem estar configuradas');
  }
  return client;
}

export const supabase = createClientOptional();
