"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EmpresaService_1 = require("../service/EmpresaService");
// ✅ IMPORT DO MIDDLEWARE CENTRALIZADO
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const service = new EmpresaService_1.EmpresaService();
// ==========================================
// ROTAS PÚBLICAS (Site - Sem autenticação)
// ==========================================
// GET /empresa/dados - Buscar dados da empresa (Site público)
router.get("/dados", async (req, res) => {
    try {
        const empresa = await service.buscarDados();
        if (!empresa) {
            res.status(404).json({ erro: "Dados da empresa não encontrados" });
            return;
        }
        res.json(empresa);
    }
    catch (err) {
        console.error("Erro ao buscar dados da empresa:", err);
        res.status(500).json({ erro: err.message });
    }
});
// ==========================================
// ROTAS PROTEGIDAS (Admin - Requer autenticação)
// ==========================================
// PUT /empresa/atualizar/:id - Atualizar dados da empresa (Admin)
router.put("/atualizar/:id", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nome, endereco, telefone, instagram, facebook, whatsapp, imagem_url } = req.body;
        if (isNaN(id)) {
            res.status(400).json({ erro: "ID inválido" });
            return;
        }
        const data = {};
        if (nome)
            data.nome = nome;
        if (endereco)
            data.endereco = endereco;
        if (telefone)
            data.telefone = telefone;
        if (instagram)
            data.instagram = instagram;
        if (facebook)
            data.facebook = facebook;
        if (whatsapp)
            data.whatsapp = whatsapp;
        if (imagem_url)
            data.imagem_url = imagem_url;
        const empresa = await service.atualizar(id, data);
        res.json(empresa);
    }
    catch (err) {
        console.error("Erro ao atualizar dados da empresa:", err);
        res.status(400).json({ erro: err.message });
    }
});
exports.default = router;
