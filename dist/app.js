"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const encarteRoutes_1 = __importDefault(require("./routes/encarteRoutes"));
const categoriaRoutes_1 = __importDefault(require("./routes/categoriaRoutes"));
const empresaRoutes_1 = __importDefault(require("./routes/empresaRoutes"));
const sorteioRoutes_1 = __importDefault(require("./routes/sorteioRoutes"));
const contatoRoutes_1 = __importDefault(require("./routes/contatoRoutes"));
const app = (0, express_1.default)();
// ==========================================
// SEGURANÇA
// ==========================================
// Helmet: Adiciona headers de segurança HTTP
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false
}));
// CORS: Permitir tudo em desenvolvimento
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Rate Limiting: Previne brute-force e DDoS
const limiter = (0, express_rate_limit_1.default)({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: '⚠️ Muitas requisições. Tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
// ==========================================
// PARSERS
// ==========================================
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ==========================================
// ARQUIVOS ESTÁTICOS
// ==========================================
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// ==========================================
// ROTAS
// ==========================================
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use("/admin", adminRoutes_1.default);
app.use("/contato", contatoRoutes_1.default);
app.use("/encartes", encarteRoutes_1.default);
app.use("/categorias", categoriaRoutes_1.default);
app.use("/empresa", empresaRoutes_1.default);
app.use("/sorteios", sorteioRoutes_1.default);
// ==========================================
// TRATAMENTO DE ERROS GLOBAL
// ==========================================
// Rota 404 - usa apenas req e res
app.use((req, res, _next) => {
    res.status(404).json({
        error: 'Não encontrado',
        message: `A rota ${req.method} ${req.path} não existe.`,
    });
});
// Error handler global - usa err e res
app.use((err, _req, res, _next) => {
    console.error('❌ Erro não tratado:', err);
    res.status(err.status || 500).json({
        error: err.name || 'Erro interno',
        message: err.message || 'Algo deu errado no servidor.',
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map