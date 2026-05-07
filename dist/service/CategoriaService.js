"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaService = void 0;
const CategoriaRepository_1 = require("../repository/CategoriaRepository");
const repo = new CategoriaRepository_1.CategoriaRepository();
class CategoriaService {
    async listarTodas() {
        return await repo.listarTodas();
    }
    async buscarPorId(id) {
        return await repo.buscarPorId(id);
    }
    async buscarPorNome(nome) {
        return await repo.buscarPorNome(nome);
    }
    async criar(categoria) {
        // Verifica se já existe categoria com mesmo nome
        const existente = await repo.buscarPorNome(categoria.nome);
        if (existente) {
            throw new Error('Já existe uma categoria com este nome');
        }
        return await repo.criar(categoria);
    }
    // ✅ CORRIGIDO: Retorna CategoriaResponseDTO | null e lança erro se não encontrar
    async atualizar(id, categoria) {
        const existente = await repo.buscarPorId(id);
        if (!existente) {
            throw new Error('Categoria não encontrada');
        }
        // Se estiver mudando o nome, verifica se não duplica
        if (categoria.nome && categoria.nome !== existente.nome) {
            const duplicado = await repo.buscarPorNome(categoria.nome);
            if (duplicado && duplicado.id !== id) {
                throw new Error('Já existe uma categoria com este nome');
            }
        }
        const atualizada = await repo.atualizar(id, categoria);
        // ✅ GARANTE que não retorna null
        if (!atualizada) {
            throw new Error('Falha ao atualizar categoria');
        }
        return atualizada;
    }
    async excluir(id) {
        const existente = await repo.buscarPorId(id);
        if (!existente) {
            throw new Error('Categoria não encontrada');
        }
        const excluiu = await repo.excluir(id);
        if (!excluiu) {
            throw new Error('Falha ao excluir categoria');
        }
        return { mensagem: 'Categoria excluída com sucesso' };
    }
}
exports.CategoriaService = CategoriaService;
//# sourceMappingURL=CategoriaService.js.map