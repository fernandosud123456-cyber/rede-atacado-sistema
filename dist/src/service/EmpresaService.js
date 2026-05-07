"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const EmpresaRepository_1 = require("../repository/EmpresaRepository");
const repo = new EmpresaRepository_1.EmpresaRepository();
class EmpresaService {
    // ==========================================
    // LEITURA
    // ==========================================
    // Buscar dados da empresa (Site público)
    async buscarDados() {
        return await repo.buscarDados();
    }
    // ==========================================
    // ATUALIZAÇÃO
    // ==========================================
    // Atualizar dados da empresa (Admin)
    async atualizar(id, dados) {
        // Verificar se empresa existe
        const existente = await repo.buscarDados();
        if (!existente) {
            throw new Error("Empresa não encontrada");
        }
        // Validar dados básicos
        if (dados.nome && dados.nome.trim().length < 3) {
            throw new Error("Nome da empresa deve ter no mínimo 3 caracteres");
        }
        const atualizado = await repo.atualizar(id, dados);
        if (!atualizado) {
            throw new Error("Falha ao atualizar dados da empresa");
        }
        return atualizado;
    }
}
exports.EmpresaService = EmpresaService;
