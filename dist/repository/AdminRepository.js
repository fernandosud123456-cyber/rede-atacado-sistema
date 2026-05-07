"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
let supabase;
function getSupabase() {
    if (!supabase) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('⚠️ Variáveis SUPABASE_URL e SUPABASE_ANON_KEY não configuradas!');
        }
        supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    return supabase;
}
class AdminRepository {
    async buscarPorEmail(email) {
        const { data, error } = await getSupabase()
            .from('admin')
            .select('*')
            .eq('email', email)
            .single();
        if (error)
            return null;
        return data;
    }
    async buscarPorId(id) {
        const { data, error } = await getSupabase()
            .from('admin')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            return null;
        return data;
    }
    async buscarTodos() {
        const { data, error } = await getSupabase()
            .from('admin')
            .select('id, nome, email, criado_em')
            .order('nome', { ascending: true });
        if (error)
            throw new Error(error.message);
        return data || [];
    }
    async criar(admin) {
        const { data, error } = await getSupabase()
            .from('admin')
            .insert({
            nome: admin.nome,
            email: admin.email,
            senha: admin.senha
        })
            .select('id, nome, email, criado_em')
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async atualizar(id, admin) {
        const updateData = {};
        if (admin.nome !== undefined)
            updateData.nome = admin.nome;
        if (admin.email !== undefined)
            updateData.email = admin.email;
        if (admin.senha !== undefined)
            updateData.senha = admin.senha;
        const { data, error } = await getSupabase()
            .from('admin')
            .update(updateData)
            .eq('id', id)
            .select('id, nome, email, criado_em')
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async excluir(id) {
        const { error } = await getSupabase()
            .from('admin')
            .delete()
            .eq('id', id);
        if (error)
            throw new Error(error.message);
        return true;
    }
    async criarTokenRecuperacao(adminId, token, expiracao) {
        const { error } = await getSupabase()
            .from('recuperacao_senha')
            .insert({
            admin_id: adminId,
            token: token,
            expiracao: expiracao.toISOString(),
            usado: false
        });
        if (error)
            throw new Error(error.message);
    }
    async buscarTokenValido(token) {
        const { data, error } = await getSupabase()
            .from('recuperacao_senha')
            .select('admin_id, expiracao, usado')
            .eq('token', token)
            .eq('usado', false)
            .gt('expiracao', new Date().toISOString())
            .single();
        if (error)
            return null;
        return data;
    }
    async marcarTokenComoUsado(token) {
        const { error } = await getSupabase()
            .from('recuperacao_senha')
            .update({ usado: true })
            .eq('token', token);
        if (error)
            throw new Error(error.message);
    }
}
exports.AdminRepository = AdminRepository;
//# sourceMappingURL=AdminRepository.js.map