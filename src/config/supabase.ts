import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey) 
    : null;

export function getSupabase(): SupabaseClient {
    if (!supabase) {
        throw new Error('Supabase não configurado. Configure SUPABASE_URL e SUPABASE_ANON_KEY.');
    }
    return supabase;
}
