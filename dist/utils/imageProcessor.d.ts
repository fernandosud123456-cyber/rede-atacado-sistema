declare const ALLOWED_FORMATS: readonly ["jpeg", "png", "webp"];
export type ProcessedImage = {
    buffer: Buffer;
    format: typeof ALLOWED_FORMATS[number];
    ext: `.${typeof ALLOWED_FORMATS[number]}`;
    metadata: {
        width?: number;
        height?: number;
        size: number;
    };
};
export declare class ImageProcessingError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
/**
 * Processa imagem: redimensiona, otimiza e converte para WebP
 */
export declare function processImage(buffer: Buffer): Promise<ProcessedImage>;
/**
 * Versão alternativa que mantém o formato original (sem converter para WebP)
 */
export declare function processImageKeepFormat(buffer: Buffer): Promise<ProcessedImage>;
export {};
//# sourceMappingURL=imageProcessor.d.ts.map