"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ erro: "Token não fornecido" });
            return;
        }
        const [bearer, token] = authHeader.split(" ");
        if (bearer !== "Bearer" || !token) {
            res.status(401).json({ erro: "Formato de token inválido" });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ erro: "Configuração de servidor inválida" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.adminId = decoded.id;
        req.adminEmail = decoded.email;
        next();
    }
    catch (error) {
        res.status(401).json({ erro: "Token inválido ou expirado" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map