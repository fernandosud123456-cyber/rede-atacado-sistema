export interface CreateAdminDTO {
    nome: string;
    email: string;
    senha: string;
}
export interface UpdateAdminDTO {
    nome?: string;
    email?: string;
    senha?: string;
}
export interface AdminResponseDTO {
    id: number;
    nome: string;
    email: string;
    criado_em: Date;
}
export interface LoginDTO {
    email: string;
    senha: string;
}
export interface AuthResponseDTO {
    admin: AdminResponseDTO;
    token: string;
}
//# sourceMappingURL=AdminDTO.d.ts.map