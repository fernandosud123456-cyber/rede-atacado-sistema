export declare class AppError extends Error {
    readonly originalError?: unknown | undefined;
    readonly statusCode: number;
    readonly code?: string;
    constructor(message: string, statusCode: number, code?: string, originalError?: unknown | undefined);
}
//# sourceMappingURL=AppError.d.ts.map