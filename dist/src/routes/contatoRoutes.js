"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const email_1 = require("../utils/email");
const router = (0, express_1.Router)();
// Configurar Multer (armazenamento em memória para anexo no email)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Máx 5MB
    fileFilter: (req, file, cb) => {
        const allowed = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Formato inválido. Apenas PDF, DOC ou DOCX."));
        }
    }
});
// POST /contato/fale-conosco
router.post("/fale-conosco", async (req, res) => {
    try {
        const { nome, email, mensagem } = req.body;
        if (!nome || !email || !mensagem) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        const { error } = await email_1.resend.emails.send({
            from: email_1.EMAIL_FROM,
            to: [process.env.EMAIL_USER],
            replyTo: [email],
            subject: `Nova mensagem de ${nome} - Fale Conosco`,
            html: `
                <h2>Nova mensagem via Fale Conosco</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${mensagem.replace(/\n/g, "<br>")}</p>
            `
        });
        if (error)
            throw new Error(error.message);
        res.json({ sucesso: true });
    }
    catch (error) {
        console.error("Erro ao enviar email:", error);
        res.status(500).json({ erro: "Erro ao enviar mensagem. Tente novamente." });
    }
});
// POST /contato/trabalhe-conosco (COM UPLOAD DE CURRÍCULO)
router.post("/trabalhe-conosco", upload.single("curriculo"), async (req, res) => {
    try {
        const { nome, email, telefone, cargo, mensagem } = req.body;
        if (!nome || !email || !mensagem) {
            return res.status(400).json({ erro: "Nome, email e mensagem são obrigatórios" });
        }
        const file = req.file;
        const { error: sendError } = await email_1.resend.emails.send({
            from: email_1.EMAIL_FROM,
            to: [process.env.EMAIL_USER],
            replyTo: [email],
            subject: `Candidatura de ${nome} - ${cargo || "Vaga"}`,
            html: `
                <h2>Nova Candidatura - Trabalhe Conosco</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${telefone || "Não informado"}</p>
                <p><strong>Cargo desejado:</strong> ${cargo || "Não especificado"}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${mensagem.replace(/\n/g, "<br>")}</p>
            `,
            attachments: file ? [{
                    filename: file.originalname,
                    content: file.buffer.toString("base64"),
                }] : []
        });
        if (sendError)
            throw new Error(sendError.message);
        res.json({ sucesso: true });
    }
    catch (error) {
        console.error("Erro ao enviar candidatura:", error);
        res.status(500).json({ erro: error.message || "Erro ao enviar candidatura." });
    }
});
exports.default = router;
