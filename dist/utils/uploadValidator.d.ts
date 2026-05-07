export declare const ALLOWED_MIME_TYPES: string[];
export declare const MAX_DIMENSIONS = 4000;
export declare const MAX_FILE_SIZE: number;
export declare function validateAndOptimizeImage(buffer: Buffer): Promise<{
    buffer: Buffer;
    ext: string;
    mime: string;
}>;
//# sourceMappingURL=uploadValidator.d.ts.map