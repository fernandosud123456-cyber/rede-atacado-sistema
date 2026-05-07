"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSorteioSchema = exports.createSorteioSchema = exports.updateEncarteSchema = exports.createEncarteSchema = exports.updateAdminSchema = exports.loginSchema = exports.createAdminSchema = void 0;
const zod_1 = require("zod");
// ==========================================
// ADMIN SCHEMAS
// ==========================================
exports.createAdminSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: zod_1.z.string().email('E-mail inválido'),
    senha: zod_1.z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('E-mail inválido'),
    senha: zod_1.z.string().min(1, 'Senha é obrigatória'),
});
exports.updateAdminSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3).optional(),
    email: zod_1.z.string().email().optional(),
    senha: zod_1.z.string().min(6).optional(),
});
// ==========================================
// ENCARTE SCHEMAS - CORRIGIDO COM IMAGENS
// ==========================================
// Schema para criar encarte (suporta imagem_url OU imagens)
exports.createEncarteSchema = zod_1.z.object({
    titulo: zod_1.z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    imagem_url: zod_1.z.string().min(1, 'URL da imagem é obrigatória').optional(),
    imagens: zod_1.z.array(zod_1.z.string()).optional(), // ✅ NOVO: Array de URLs
    data_inicio: zod_1.z.string().transform((str) => new Date(str)),
    data_fim: zod_1.z.string().transform((str) => new Date(str)),
    ativo: zod_1.z.boolean().optional(),
    categoria_id: zod_1.z.number().int().positive().nullable().optional(),
}).refine((data) => data.imagem_url || (data.imagens && data.imagens.length > 0), {
    message: "É obrigatório fornecer imagem_url OU imagens",
    path: ["imagem_url"],
});
// Schema para atualizar encarte
exports.updateEncarteSchema = zod_1.z.object({
    titulo: zod_1.z.string().min(3).optional(),
    imagem_url: zod_1.z.string().min(1).optional(),
    imagens: zod_1.z.array(zod_1.z.string()).optional(), // ✅ NOVO: Array de URLs
    data_inicio: zod_1.z.string().transform((str) => new Date(str)).optional(),
    data_fim: zod_1.z.string().transform((str) => new Date(str)).optional(),
    ativo: zod_1.z.boolean().optional(),
    categoria_id: zod_1.z.number().int().positive().nullable().optional(),
});
// ==========================================
// SORTEIO SCHEMAS
// ==========================================
exports.createSorteioSchema = zod_1.z.object({
    titulo: zod_1.z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    descricao: zod_1.z.string().optional(),
    imagem_url: zod_1.z.string().min(1, 'URL da imagem é obrigatória'),
    data_inicio: zod_1.z.string().transform((str) => new Date(str)),
    data_fim: zod_1.z.string().transform((str) => new Date(str)),
    ativo: zod_1.z.boolean().optional(),
});
exports.updateSorteioSchema = zod_1.z.object({
    titulo: zod_1.z.string().min(3).optional(),
    descricao: zod_1.z.string().optional(),
    imagem_url: zod_1.z.string().min(1).optional(),
    data_inicio: zod_1.z.string().transform((str) => new Date(str)).optional(),
    data_fim: zod_1.z.string().transform((str) => new Date(str)).optional(),
    ativo: zod_1.z.boolean().optional(),
});
