"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_FILE_SIZE = exports.MAX_DIMENSIONS = exports.ALLOWED_MIME_TYPES = void 0;
exports.validateAndOptimizeImage = validateAndOptimizeImage;
const sharp_1 = __importDefault(require("sharp"));
exports.ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
exports.MAX_DIMENSIONS = 4000; // px
exports.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
async function validateAndOptimizeImage(buffer) {
    // 1. Validação simplificada por mimetype (sem file-type)
    // Em produção, recomendo implementar validação por magic bytes
    const mime = buffer.toString("hex", 0, 4);
    // Verifica cabeçalhos básicos de JPEG, PNG ou WebP
    if (!mime.startsWith("ffd8") && // JPEG
        !mime.startsWith("89504e47") && // PNG
        !mime.startsWith("52494646")) { // WebP/RIFF
        throw new Error("Formato de imagem inválido. Use JPEG, PNG ou WebP.");
    }
    // 2. Valida dimensões
    const metadata = await (0, sharp_1.default)(buffer).metadata();
    if ((metadata.width || 0) > exports.MAX_DIMENSIONS || (metadata.height || 0) > exports.MAX_DIMENSIONS) {
        throw new Error("Imagem muito grande. Dimensão máxima: 4000px.");
    }
    // 3. Otimiza e converte para WebP (mais leve, mesma qualidade)
    const optimized = await (0, sharp_1.default)(buffer)
        .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
    return {
        buffer: optimized,
        ext: ".webp",
        mime: "image/webp"
    };
}
