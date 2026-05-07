"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EncarteService_1 = require("../service/EncarteService");
const CategoriaService_1 = require("../service/CategoriaService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const service = new EncarteService_1.EncarteService();
const categoriaService = new CategoriaService_1.CategoriaService();
// Configuração do multer para upload de imagens
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        allowed.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error('Formato inválido. Use JPG, PNG ou WebP.'));
    },
});
// ============================================================================
// ROTAS PÚBLICAS
// ============================================================================
router.get("/ativos", async (req, res) => {
    try {
        const encartes = await service.listarAtivos();
        const formatados = encartes.map(e => ({
            ...e,
            imagens: e.imagens || (e.imagem_url ? [e.imagem_url] : []),
            categoria_nome: e.categorias?.nome || e.categoria_nome || 'Ofertas',
            categoria_cor: e.categorias?.cor || e.categoria_cor || '#ff6600',
            categoria_icone: e.categorias?.icone || e.categoria_icone || '🏷️'
        }));
        console.log('📤 Encartes ativos retornados:', formatados.length);
        res.json(formatados);
    }
    catch (err) {
        console.error("❌ Erro ao listar encartes ativos:", err);
        res.status(500).json({ erro: err.message });
    }
});
router.get("/futuros", async (req, res) => {
    try {
        const encartes = await service.listarFuturos();
        res.json(encartes);
    }
    catch (err) {
        console.error("❌ Erro ao listar encartes futuros:", err);
        res.status(500).json({ erro: err.message });
    }
});
// ============================================================================
// ROTAS PROTEGIDAS (Admin)
// ============================================================================
// ✅ CRIAÇÃO COM IMAGENS - CORRIGIDO TIPO
router.post('/com-imagens', authMiddleware_1.authMiddleware, upload.array('imagens', 20), async (req, res) => {
    try {
        const dados = {
            titulo: req.body.titulo?.trim(),
            data_inicio: req.body.data_inicio,
            data_fim: req.body.data_fim,
            ativo: req.body.ativo !== undefined ? req.body.ativo === 'true' : undefined,
            categoria_id: req.body.categoria_id ? parseInt(req.body.categoria_id) : undefined
        };
        // Validação básica no backend
        if (!dados.titulo || dados.titulo.length < 3) {
            return res.status(400).json({ erro: 'Título deve ter pelo menos 3 caracteres' });
        }
        if (!dados.data_inicio || !dados.data_fim) {
            return res.status(400).json({ erro: 'Datas de início e fim são obrigatórias' });
        }
        if (dados.data_inicio && dados.data_fim && new Date(dados.data_fim) <= new Date(dados.data_inicio)) {
            return res.status(400).json({ erro: 'Data final deve ser posterior à data inicial' });
        }
        // ✅ CORREÇÃO: Tipagem correta do multer
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ erro: 'Pelo menos uma imagem é obrigatória' });
        }
        // ✅ CORREÇÃO: Passando array de arquivos corretamente
        const encarte = await service.criarComImagens(dados, files);
        return res.status(201).json({
            sucesso: true,
            mensagem: 'Encarte criado com sucesso',
            dados: encarte
        });
    }
    catch (error) {
        console.error('❌ Erro ao criar encarte:', error);
        res.status(400).json({ erro: error.message });
    }
});
// ✅ LISTAR TODOS (Admin)
router.get("/listar", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const result = await service.buscarTodos();
        const normalizado = {
            ...result,
            data: result.data.map(e => ({
                ...e,
                categoria_nome: e.categorias?.nome || e.categoria_nome,
                categoria_cor: e.categorias?.cor || e.categoria_cor,
                categoria_icone: e.categorias?.icone || e.categoria_icone
            }))
        };
        res.json(normalizado);
    }
    catch (err) {
        console.error("❌ Erro ao listar encartes:", err);
        res.status(500).json({ erro: err.message });
    }
});
// ✅ BUSCAR POR ID
router.get("/buscar/:id", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ erro: "ID inválido" });
        const encarte = await service.buscarPorId(id);
        if (!encarte)
            return res.status(404).json({ erro: "Encarte não encontrado" });
        res.json(encarte);
    }
    catch (err) {
        console.error("❌ Erro ao buscar encarte:", err);
        res.status(500).json({ erro: err.message });
    }
});
// ✅ ATUALIZAR - CORRIGIDO TIPO
router.put("/atualizar/:id", authMiddleware_1.authMiddleware, upload.array("imagem", 20), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ erro: "ID inválido" });
        const { titulo, data_inicio, data_fim, ativo, categoria_id } = req.body;
        const updateData = {
            titulo: titulo?.trim() || undefined,
            data_inicio: data_inicio || undefined,
            data_fim: data_fim || undefined,
            ativo: ativo !== undefined ? (ativo === "true" || ativo === true) : undefined,
            categoria_id: (categoria_id !== undefined && categoria_id !== "") ? parseInt(categoria_id) : undefined
        };
        // ✅ CORREÇÃO: Tipagem correta do multer
        const files = req.files;
        const encarte = await service.atualizar(id, updateData, files);
        res.json(encarte);
    }
    catch (err) {
        console.error("❌ Erro ao atualizar encarte:", err);
        res.status(400).json({ erro: err.message });
    }
});
// ✅ EXCLUIR
router.delete("/excluir/:id", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ erro: "ID inválido" });
        const result = await service.deletar(id);
        res.json(result);
    }
    catch (err) {
        console.error("❌ Erro ao excluir encarte:", err);
        res.status(400).json({ erro: err.message });
    }
});
// ✅ ALTERAR STATUS
router.post("/alterar-status/:id", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { ativo } = req.body;
        if (isNaN(id) || ativo === undefined) {
            return res.status(400).json({ erro: "Parâmetros inválidos" });
        }
        const encarte = await service.atualizarStatus(id, ativo === true || ativo === "true");
        res.json(encarte);
    }
    catch (err) {
        console.error("❌ Erro ao alterar status:", err);
        res.status(400).json({ erro: err.message });
    }
});
exports.default = router;
