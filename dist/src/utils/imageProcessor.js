"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessingError = void 0;
exports.processImage = processImage;
exports.processImageKeepFormat = processImageKeepFormat;
// src/utils/imageProcessor.ts
const sharp_1 = __importDefault(require("sharp"));
// Configurações
const ALLOWED_FORMATS = ['jpeg', 'png', 'webp'];
const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 85;
class ImageProcessingError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'ImageProcessingError';
    }
}
exports.ImageProcessingError = ImageProcessingError;
/**
 * Valida se o buffer contém uma imagem válida e retorna seu formato
 */
async function detectFormat(buffer) {
    try {
        const metadata = await (0, sharp_1.default)(buffer).metadata();
        if (!metadata.format || !ALLOWED_FORMATS.includes(metadata.format)) {
            throw new ImageProcessingError(`Formato não suportado: ${metadata.format || 'desconhecido'}. Use JPEG, PNG ou WebP.`, 'UNSUPPORTED_FORMAT');
        }
        return metadata.format;
    }
    catch (error) {
        if (error instanceof ImageProcessingError)
            throw error;
        if (error instanceof Error && error.message.includes('Input buffer contains')) {
            throw new ImageProcessingError('Arquivo corrompido ou não é uma imagem válida.', 'INVALID_IMAGE');
        }
        throw new ImageProcessingError('Erro ao analisar imagem: ' + (error instanceof Error ? error.message : 'unknown'), 'ANALYSIS_FAILED');
    }
}
/**
 * Processa imagem: redimensiona, otimiza e converte para WebP
 */
async function processImage(buffer) {
    // 1. Detecta formato original
    const originalFormat = await detectFormat(buffer);
    // 2. Processa com Sharp
    const pipeline = (0, sharp_1.default)(buffer)
        // Corrige orientação automática (EXIF de celulares)
        .rotate()
        // Redimensiona mantendo proporção, sem aumentar imagens pequenas
        .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true
    });
    // 3. Converte para WebP para melhor compressão
    const processedBuffer = await pipeline
        .webp({
        quality: WEBP_QUALITY,
        effort: 6 // Balance entre velocidade e compressão
    })
        .toBuffer();
    // 4. Obtém metadados da imagem processada
    const finalMetadata = await (0, sharp_1.default)(processedBuffer).metadata();
    return {
        buffer: processedBuffer,
        format: 'webp',
        ext: '.webp',
        metadata: {
            width: finalMetadata.width,
            height: finalMetadata.height,
            size: processedBuffer.length
        }
    };
}
/**
 * Versão alternativa que mantém o formato original (sem converter para WebP)
 */
async function processImageKeepFormat(buffer) {
    const originalFormat = await detectFormat(buffer);
    const pipeline = (0, sharp_1.default)(buffer)
        .rotate()
        .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true
    });
    // Mantém formato original com otimização específica
    let processedBuffer;
    switch (originalFormat) {
        case 'jpeg':
            processedBuffer = await pipeline.jpeg({
                quality: 85,
                progressive: true
            }).toBuffer();
            break;
        case 'png':
            processedBuffer = await pipeline.png({
                quality: 80,
                compressionLevel: 8
            }).toBuffer();
            break;
        case 'webp':
            processedBuffer = await pipeline.webp({
                quality: WEBP_QUALITY
            }).toBuffer();
            break;
    }
    const finalMetadata = await (0, sharp_1.default)(processedBuffer).metadata();
    return {
        buffer: processedBuffer,
        format: originalFormat,
        ext: `.${originalFormat}`,
        metadata: {
            width: finalMetadata.width,
            height: finalMetadata.height,
            size: processedBuffer.length
        }
    };
}
