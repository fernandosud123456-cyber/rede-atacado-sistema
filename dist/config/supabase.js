"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.getSupabase = getSupabase;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
exports.supabase = (supabaseUrl && supabaseKey)
    ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey)
    : null;
function getSupabase() {
    if (!exports.supabase) {
        throw new Error('Supabase não configurado. Configure SUPABASE_URL e SUPABASE_ANON_KEY.');
    }
    return exports.supabase;
}
