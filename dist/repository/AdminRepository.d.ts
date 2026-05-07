import { Admin } from "../entity/Admin";
import { CreateAdminDTO, UpdateAdminDTO, AdminResponseDTO } from "../entity/AdminDTO";
export declare class AdminRepository {
    buscarPorEmail(email: string): Promise<Admin | null>;
    buscarPorId(id: number): Promise<Admin | null>;
    buscarTodos(): Promise<AdminResponseDTO[]>;
    criar(admin: CreateAdminDTO): Promise<AdminResponseDTO>;
    atualizar(id: number, admin: UpdateAdminDTO): Promise<AdminResponseDTO | null>;
    excluir(id: number): Promise<boolean>;
    criarTokenRecuperacao(adminId: number, token: string, expiracao: Date): Promise<void>;
    buscarTokenValido(token: string): Promise<{
        admin_id: number;
        expiracao: Date;
        usado: boolean;
    } | null>;
    marcarTokenComoUsado(token: string): Promise<void>;
}
//# sourceMappingURL=AdminRepository.d.ts.map