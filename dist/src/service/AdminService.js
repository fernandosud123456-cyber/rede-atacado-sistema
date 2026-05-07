"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const AdminRepository_1 = require("../repository/AdminRepository");
const validations_1 = require("../utils/validations");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
const email_1 = require("../utils/email");
const repo = new AdminRepository_1.AdminRepository();
class AdminService {
    // ==========================================
    // CADASTRO
    // ==========================================
    async cadastrar(data) {
        const validated = validations_1.createAdminSchema.parse(data);
        const existe = await repo.buscarPorEmail(validated.email);
        if (existe) {
            throw new Error("E-mail já cadastrado");
        }
        const hash = await bcrypt_1.default.hash(validated.senha, 12);
        return await repo.criar({
            nome: validated.nome,
            email: validated.email,
            senha: hash,
        });
    }
    // ==========================================
    // LOGIN
    // ==========================================
    async login(data) {
        const validated = validations_1.loginSchema.parse(data);
        const admin = await repo.buscarPorEmail(validated.email);
        if (!admin) {
            throw new Error("E-mail ou senha inválidos");
        }
        const senhaValida = await bcrypt_1.default.compare(validated.senha, admin.senha);
        if (!senhaValida) {
            throw new Error("E-mail ou senha inválidos");
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET não configurado no ambiente");
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, jwtSecret, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
        const adminResponse = {
            id: admin.id,
            nome: admin.nome,
            email: admin.email,
            criado_em: admin.criado_em || new Date(),
        };
        return { admin: adminResponse, token };
    }
    // ==========================================
    // VALIDAR TOKEN
    // ==========================================
    async validarToken(token) {
        try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("JWT_SECRET não configurado");
            }
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            const admin = await repo.buscarPorId(decoded.id);
            if (!admin) {
                throw new Error("Admin não encontrado");
            }
            return {
                id: admin.id,
                nome: admin.nome,
                email: admin.email,
                criado_em: admin.criado_em || new Date(),
            };
        }
        catch (error) {
            throw new Error("Token inválido ou expirado");
        }
    }
    // ==========================================
    // RECUPERAÇÃO DE SENHA
    // ==========================================
    async solicitarRecuperacaoSenha(email) {
        const admin = await repo.buscarPorEmail(email);
        // Por segurança, sempre retorna a mesma mensagem (evita enumeração de emails)
        const msgSegura = "Se o e-mail estiver cadastrado, você receberá um link de recuperação.";
        if (!admin)
            return { mensagem: msgSegura };
        // Gera token seguro e expiração (1 hora)
        const token = crypto.randomBytes(32).toString("hex");
        const expiracao = new Date(Date.now() + 3600000);
        // Salva no banco
        await repo.criarTokenRecuperacao(admin.id, token, expiracao);
        // Envia email
        try {
            await (0, email_1.enviarEmailRecuperacao)(email, token);
        }
        catch (error) {
            console.error("Erro ao enviar email:", error);
            // Falha no email não deve quebrar o fluxo, mas logamos
        }
        return { mensagem: msgSegura };
    }
    async resetarSenha(token, novaSenha) {
        // Busca token válido (não usado e não expirado)
        const tokenData = await repo.buscarTokenValido(token);
        if (!tokenData) {
            throw new Error("Token inválido ou expirado");
        }
        // Hash da nova senha
        const hashedSenha = await bcrypt_1.default.hash(novaSenha, 12);
        // Atualiza senha no banco
        await repo.atualizar(tokenData.admin_id, { senha: hashedSenha });
        // Invalida token
        await repo.marcarTokenComoUsado(token);
        return { mensagem: "Senha redefinida com sucesso!" };
    }
    // ==========================================
    // EXCLUIR ADMIN
    // ==========================================
    async excluir(id) {
        const excluiu = await repo.excluir(id);
        if (!excluiu) {
            throw new Error("Admin não encontrado");
        }
        return { mensagem: "Admin excluído com sucesso!" };
    }
}
exports.AdminService = AdminService;
