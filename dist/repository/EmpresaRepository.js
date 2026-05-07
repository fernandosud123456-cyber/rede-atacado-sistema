"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaRepository = void 0;
const database_1 = require("../config/database");
class EmpresaRepository {
    // Buscar dados da empresa (primeiro registro), cria registro padrão se não existir
    async buscarDados() {
        try {
            const result = await database_1.pool.query("SELECT * FROM empresa LIMIT 1");
            if (result.rows[0]) {
                return result.rows[0];
            }
            // Auto-criar registro padrão se a tabela estiver vazia
            const insert = await database_1.pool.query(`INSERT INTO empresa (nome, endereco, telefone, instagram, facebook, whatsapp)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`, [
                'Certo Atacado',
                'Endereço não informado',
                '',
                '',
                '',
                ''
            ]);
            return insert.rows[0] || null;
        }
        catch (error) {
            console.error('Erro ao buscar dados da empresa:', error);
            throw error;
        }
    }
    // Atualizar dados da empresa
    async atualizar(id, dados) {
        try {
            const fields = [];
            const values = [];
            let paramCount = 1;
            if (dados.nome !== undefined) {
                fields.push(`nome = $${paramCount++}`);
                values.push(dados.nome);
            }
            if (dados.endereco !== undefined) {
                fields.push(`endereco = $${paramCount++}`);
                values.push(dados.endereco);
            }
            if (dados.telefone !== undefined) {
                fields.push(`telefone = $${paramCount++}`);
                values.push(dados.telefone);
            }
            if (dados.instagram !== undefined) {
                fields.push(`instagram = $${paramCount++}`);
                values.push(dados.instagram);
            }
            if (dados.facebook !== undefined) {
                fields.push(`facebook = $${paramCount++}`);
                values.push(dados.facebook);
            }
            if (dados.whatsapp !== undefined) {
                fields.push(`whatsapp = $${paramCount++}`);
                values.push(dados.whatsapp);
            }
            if (fields.length === 0) {
                return await this.buscarDados();
            }
            values.push(id);
            const query = `
                UPDATE empresa 
                SET ${fields.join(', ')}
                WHERE id = $${paramCount} 
                RETURNING *
            `;
            const result = await database_1.pool.query(query, values);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error('Erro ao atualizar dados da empresa:', error);
            throw error;
        }
    }
}
exports.EmpresaRepository = EmpresaRepository;
//# sourceMappingURL=EmpresaRepository.js.map