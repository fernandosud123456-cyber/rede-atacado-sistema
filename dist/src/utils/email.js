"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_FROM = exports.resend = void 0;
exports.enviarEmailRecuperacao = enviarEmailRecuperacao;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
exports.resend = resend;
const EMAIL_FROM = process.env.EMAIL_FROM || "Certo Atacado <onboarding@resend.dev>";
exports.EMAIL_FROM = EMAIL_FROM;
async function enviarEmailRecuperacao(destinatario, token) {
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/resetar-senha.html?token=${token}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #ff6600;">🔐 Recuperação de Senha</h2>
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir sua senha no <strong>Certo Atacado</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #ff6600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Senha</a>
            </div>
            <p style="color: #666; font-size: 13px;">Este link expira em 1 hora. Se você não solicitou isso, ignore este email.</p>
        </div>
    `;
    const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: [destinatario],
        subject: "Redefinição de Senha - Certo Atacado",
        html,
    });
    if (error) {
        throw new Error(`Erro ao enviar email: ${error.message}`);
    }
}
