"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.getSupabase = getSupabase;
const supabase_js_1 = require("@supabase/supabase-js");
function createClientOptional() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key)
        return null;
    return (0, supabase_js_1.createClient)(url, key);
}
function getSupabase() {
    const client = createClientOptional();
    if (!client) {
        throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY devem estar configuradas');
    }
    return client;
}
exports.supabase = createClientOptional();
