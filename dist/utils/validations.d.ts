import { z } from 'zod';
export declare const createAdminSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodString;
    senha: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    nome: string;
    senha: string;
}, {
    email: string;
    nome: string;
    senha: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    senha: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    senha: string;
}, {
    email: string;
    senha: string;
}>;
export declare const updateAdminSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    senha: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    nome?: string | undefined;
    senha?: string | undefined;
}, {
    email?: string | undefined;
    nome?: string | undefined;
    senha?: string | undefined;
}>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export declare const createEncarteSchema: z.ZodEffects<z.ZodObject<{
    titulo: z.ZodString;
    imagem_url: z.ZodOptional<z.ZodString>;
    imagens: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    data_inicio: z.ZodEffects<z.ZodString, Date, string>;
    data_fim: z.ZodEffects<z.ZodString, Date, string>;
    ativo: z.ZodOptional<z.ZodBoolean>;
    categoria_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    titulo: string;
    data_inicio: Date;
    data_fim: Date;
    imagem_url?: string | undefined;
    imagens?: string[] | undefined;
    ativo?: boolean | undefined;
    categoria_id?: number | null | undefined;
}, {
    titulo: string;
    data_inicio: string;
    data_fim: string;
    imagem_url?: string | undefined;
    imagens?: string[] | undefined;
    ativo?: boolean | undefined;
    categoria_id?: number | null | undefined;
}>, {
    titulo: string;
    data_inicio: Date;
    data_fim: Date;
    imagem_url?: string | undefined;
    imagens?: string[] | undefined;
    ativo?: boolean | undefined;
    categoria_id?: number | null | undefined;
}, {
    titulo: string;
    data_inicio: string;
    data_fim: string;
    imagem_url?: string | undefined;
    imagens?: string[] | undefined;
    ativo?: boolean | undefined;
    categoria_id?: number | null | undefined;
}>;
export declare const updateEncarteSchema: z.ZodObject<{
    titulo: z.ZodOptional<z.ZodString>;
    imagem_url: z.ZodOptional<z.ZodString>;
    imagens: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    data_inicio: z.ZodOptional<z.ZodEffects<z.ZodString, Date, string>>;
    data_fim: z.ZodOptional<z.ZodEffects<z.ZodString, Date, string>>;
    ativo: z.ZodOptional<z.ZodBoolean>;
    categoria_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    titulo?: string | undefined;
    imagem_url?: string | undefined;
    imagens?: string[] | undefined;
    data_inicio?: Date | undefined;
    data_fim?: Date | undefined;
    ativo?: boolean | undefined;
    categoria_id?: number | null | undefined;
}, {
    titulo?: string | undefined;
    imagem_url?: string | undefined;
    imagens?: string[] | undefined;
    data_inicio?: string | undefined;
    data_fim?: string | undefined;
    ativo?: boolean | undefined;
    categoria_id?: number | null | undefined;
}>;
export type CreateEncarteInput = z.infer<typeof createEncarteSchema>;
export type UpdateEncarteInput = z.infer<typeof updateEncarteSchema>;
export declare const createSorteioSchema: z.ZodObject<{
    titulo: z.ZodString;
    descricao: z.ZodOptional<z.ZodString>;
    imagem_url: z.ZodString;
    data_inicio: z.ZodEffects<z.ZodString, Date, string>;
    data_fim: z.ZodEffects<z.ZodString, Date, string>;
    ativo: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    titulo: string;
    imagem_url: string;
    data_inicio: Date;
    data_fim: Date;
    ativo?: boolean | undefined;
    descricao?: string | undefined;
}, {
    titulo: string;
    imagem_url: string;
    data_inicio: string;
    data_fim: string;
    ativo?: boolean | undefined;
    descricao?: string | undefined;
}>;
export declare const updateSorteioSchema: z.ZodObject<{
    titulo: z.ZodOptional<z.ZodString>;
    descricao: z.ZodOptional<z.ZodString>;
    imagem_url: z.ZodOptional<z.ZodString>;
    data_inicio: z.ZodOptional<z.ZodEffects<z.ZodString, Date, string>>;
    data_fim: z.ZodOptional<z.ZodEffects<z.ZodString, Date, string>>;
    ativo: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    titulo?: string | undefined;
    imagem_url?: string | undefined;
    data_inicio?: Date | undefined;
    data_fim?: Date | undefined;
    ativo?: boolean | undefined;
    descricao?: string | undefined;
}, {
    titulo?: string | undefined;
    imagem_url?: string | undefined;
    data_inicio?: string | undefined;
    data_fim?: string | undefined;
    ativo?: boolean | undefined;
    descricao?: string | undefined;
}>;
export type CreateSorteioInput = z.infer<typeof createSorteioSchema>;
export type UpdateSorteioInput = z.infer<typeof updateSorteioSchema>;
//# sourceMappingURL=validations.d.ts.map