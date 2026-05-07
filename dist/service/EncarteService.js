"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncarteService = void 0;
// src/service/EncarteService.ts
const supabase_js_1 = require("@supabase/supabase-js");
const AppError_1 = require("../utils/AppError");
const http_status_codes_1 = require("http-status-codes");
class EncarteService {
    constructor() {
        this.supabase = null;
        this.STORAGE_BUCKET = 'encartes';
    }
    getSupabase() {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_ANON_KEY;
        if (!url || !key) {
            throw new AppError_1.AppError('Supabase não configurado', http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE);
        }
        if (!this.supabase) {
            this.supabase = (0, supabase_js_1.createClient)(url, key);
        }
        return this.supabase;
    }
    async criar(data, arquivo) {
        try {
            let imagem_url = null;
            if (arquivo) {
                imagem_url = await this.uploadImagem(arquivo, data.titulo);
            }
            const { data: encarte, error } = await this.supabase
                .from('encartes')
                .insert({
                titulo: data.titulo,
                imagem_url,
                data_inicio: data.data_inicio,
                data_fim: data.data_fim,
                ativo: data.ativo ?? true,
                categoria_id: data.categoria_id,
                criado_em: new Date().toISOString()
            })
                .select(`
          *,
          categorias!left (
            id,
            nome,
            cor,
            icone
          )
        `)
                .single();
            if (error) {
                throw new AppError_1.AppError(`Erro ao criar encarte: ${error.message}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return encarte;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Erro ao criar encarte', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, undefined, error);
        }
    }
    async buscarTodos(filtros) {
        try {
            const { pagina = 1, limite = 100, ativo, categoria_id } = filtros || {};
            const inicio = (pagina - 1) * limite;
            const fim = inicio + limite - 1;
            let query = this.supabase
                .from('encartes')
                .select(`
          *,
          categorias!left (
            id,
            nome,
            cor,
            icone
          )
        `, { count: 'exact' });
            if (ativo !== undefined) {
                query = query.eq('ativo', ativo);
            }
            if (categoria_id) {
                query = query.eq('categoria_id', categoria_id);
            }
            query = query.order('criado_em', { ascending: false });
            const { data, error, count } = await query.range(inicio, fim);
            if (error) {
                throw new AppError_1.AppError(`Erro ao buscar encartes: ${error.message}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return {
                data: data || [],
                total: count || 0
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Erro ao buscar encartes', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, undefined, error);
        }
    }
    async buscarPorId(id) {
        try {
            const { data, error } = await this.supabase
                .from('encartes')
                .select(`
          *,
          categorias!left (
            id,
            nome,
            descricao,
            cor,
            icone
          )
        `)
                .eq('id', id)
                .single();
            if (error) {
                throw new AppError_1.AppError(`Erro ao buscar encarte: ${error.message}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            if (!data) {
                throw new AppError_1.AppError('Encarte não encontrado', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return data;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Erro ao buscar encarte', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, undefined, error);
        }
    }
    async atualizar(id, data, arquivos) {
        try {
            const encarteExistente = await this.buscarPorId(id);
            let imagem_url = encarteExistente.imagem_url;
            let imagens = encarteExistente.imagens || [];
            if (arquivos && arquivos.length > 0) {
                if (encarteExistente.imagem_url) {
                    await this.deletarImagem(encarteExistente.imagem_url);
                }
                if (imagens.length > 0) {
                    for (const img of imagens) {
                        await this.deletarImagem(img);
                    }
                }
                const imagemUrls = [];
                for (const arquivo of arquivos) {
                    const url = await this.uploadImagem(arquivo, data.titulo || encarteExistente.titulo);
                    imagemUrls.push(url);
                }
                imagem_url = imagemUrls[0] || null;
                imagens = imagemUrls;
            }
            const updateData = {
                titulo: data.titulo,
                data_inicio: data.data_inicio,
                data_fim: data.data_fim,
                ativo: data.ativo,
                categoria_id: data.categoria_id
            };
            if (imagem_url !== encarteExistente.imagem_url) {
                updateData.imagem_url = imagem_url;
            }
            if (imagens.length > 0) {
                updateData.imagens = imagens;
            }
            const { data: encarte, error } = await this.supabase
                .from('encartes')
                .update(updateData)
                .eq('id', id)
                .select(`
          *,
          categorias!left (
            id,
            nome,
            cor,
            icone
          )
        `)
                .single();
            if (error) {
                throw new AppError_1.AppError(`Erro ao atualizar encarte: ${error.message}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return encarte;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Erro ao atualizar encarte', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, undefined, error);
        }
    }
    async deletar(id) {
        try {
            const encarte = await this.buscarPorId(id);
            if (encarte.imagem_url) {
                await this.deletarImagem(encarte.imagem_url);
            }
            if (encarte.imagens && encarte.imagens.length > 0) {
                for (const img of encarte.imagens) {
                    await this.deletarImagem(img);
                }
            }
            const { error } = await this.supabase
                .from('encartes')
                .delete()
                .eq('id', id);
            if (error) {
                throw new AppError_1.AppError(`Erro ao deletar encarte: ${error.message}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Erro ao deletar encarte', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, undefined, error);
        }
    }
    async atualizarStatus(id, ativo) {
        try {
            const { data, error } = await this.supabase
                .from('encartes')
                .update({ ativo })
                .eq('id', id)
                .select(`
          *,
          categorias!left (
            id,
            nome,
            cor,
            icone
          )
        `)
                .single();
            if (error) {
                throw new AppError_1.AppError(`Erro ao atualizar status: ${error.message}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            if (!data) {
                throw new AppError_1.AppError('Encarte não encontrado', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return data;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Erro ao atualizar status', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, undefined, error);
        }
    }
    async listarAtivos(categoria_id) {
        try {
            let query = this.supabase
                .from('encartes')
                .select(`
          *,
          categorias!left (
            id,
            nome,
            cor,
            icone
          )
        `)
                .eq('ativo', true)
                .lte('data_inicio', new Date().toISOString())
                .gte('data_fim', new Date().toISOString())
                .order('data_inicio', { ascending: false });
            if (categoria_id) {
                query = query.eq('categoria_id', categoria_id);
            }
            const { data, error } = await query;
            if (error) {
                throw new AppError_1.AppError(`Erro ao buscar encartes ativos: ${error.message}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return data || [];
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Erro ao buscar encartes ativos', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, undefined, error);
        }
    }
    async listarFuturos() {
        try {
            const { data, error } = await this.supabase
                .from('encartes')
                .select(`
          *,
          categorias!left (
            id,
            nome,
            cor,
            icone
          )
        `)
                .eq('ativo', true)
                .gt('data_inicio', new Date().toISOString())
                .order('data_inicio', { ascending: true });
            if (error) {
                throw new AppError_1.AppError(`Erro ao buscar encartes futuros: ${error.message}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return data || [];
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Erro ao buscar encartes futuros', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, undefined, error);
        }
    }
    async criarComImagens(data, arquivos) {
        try {
            console.log('📥 Criando encarte:', data);
            // ✅ OTIMIZAÇÃO: Upload em paralelo para melhorar velocidade
            const imagemUrls = await Promise.all(arquivos.map(arquivo => this.uploadImagem(arquivo, data.titulo)));
            const insertData = {
                titulo: data.titulo,
                imagem_url: imagemUrls[0] || null,
                data_inicio: data.data_inicio,
                data_fim: data.data_fim,
                ativo: data.ativo ?? true,
                categoria_id: data.categoria_id || null,
                imagens: imagemUrls,
                criado_em: new Date().toISOString()
            };
            console.log('📤 Dados para insert:', insertData);
            const { data: encarte, error } = await this.supabase
                .from('encartes')
                .insert(insertData)
                .select(`
          *,
          categorias!left (
            id,
            nome,
            cor,
            icone
          )
        `)
                .single();
            if (error) {
                console.error('❌ Erro ao criar:', error);
                throw new AppError_1.AppError(`Erro ao criar encarte: ${error.message}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            console.log('✅ Encarte criado:', encarte);
            return encarte;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError('Erro ao criar encarte com imagens', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, undefined, error);
        }
    }
    async uploadImagem(arquivo, titulo) {
        const tituloSanitizado = titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const nomeArquivo = `${Date.now()}-${tituloSanitizado}`;
        const caminho = `${nomeArquivo}`;
        const { error: uploadError } = await this.getSupabase().storage
            .from(this.STORAGE_BUCKET)
            .upload(caminho, arquivo.buffer, {
            contentType: arquivo.mimetype,
            upsert: false
        });
        if (uploadError) {
            throw new AppError_1.AppError(`Erro ao fazer upload: ${uploadError.message}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
        const { data } = this.getSupabase().storage
            .from(this.STORAGE_BUCKET)
            .getPublicUrl(caminho);
        return data.publicUrl;
    }
    async deletarImagem(imagemUrl) {
        try {
            const partes = imagemUrl.split('/');
            const nomeArquivo = partes[partes.length - 1];
            await this.getSupabase().storage
                .from(this.STORAGE_BUCKET)
                .remove([nomeArquivo]);
        }
        catch (error) {
            console.error('Erro ao deletar imagem:', error);
        }
    }
}
exports.EncarteService = EncarteService;
