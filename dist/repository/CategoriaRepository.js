"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaRepository = void 0;
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
class CategoriaRepository {
    async listarTodas() {
        const { data, error } = await getSupabase()
            .from('categorias')
            .select('*')
            .order('ordem', { ascending: true })
            .order('nome', { ascending: true });
        if (error)
            throw new Error(error.message);
        return data || [];
    }
    async buscarPorId(id) {
        const { data, error } = await getSupabase()
            .from('categorias')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            return null;
        return data;
    }
    async buscarPorNome(nome) {
        const { data, error } = await getSupabase()
            .from('categorias')
            .select('*')
            .ilike('nome', nome)
            .single();
        if (error)
            return null;
        return data;
    }
    async criar(categoria) {
        const { data, error } = await getSupabase()
            .from('categorias')
            .insert({
            nome: categoria.nome,
            descricao: categoria.descricao || null,
            cor: categoria.cor || '#ff6600',
            icone: categoria.icone || '🏷️',
            ativo: categoria.ativo ?? true,
            ordem: categoria.ordem ?? 0
        })
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async atualizar(id, categoria) {
        const updateData = { atualizado_em: new Date().toISOString() };
        if (categoria.nome !== undefined)
            updateData.nome = categoria.nome;
        if (categoria.descricao !== undefined)
            updateData.descricao = categoria.descricao;
        if (categoria.cor !== undefined)
            updateData.cor = categoria.cor;
        if (categoria.icone !== undefined)
            updateData.icone = categoria.icone;
        if (categoria.ativo !== undefined)
            updateData.ativo = categoria.ativo;
        if (categoria.ordem !== undefined)
            updateData.ordem = categoria.ordem;
        const { data, error } = await getSupabase()
            .from('categorias')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async excluir(id) {
        const { error } = await getSupabase()
            .from('categorias')
            .delete()
            .eq('id', id);
        if (error)
            throw new Error(error.message);
        return true;
    }
}
exports.CategoriaRepository = CategoriaRepository;
//# sourceMappingURL=CategoriaRepository.js.map