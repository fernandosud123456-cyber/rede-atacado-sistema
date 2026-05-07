import { CreateAdminDTO, LoginDTO, AdminResponseDTO, AuthResponseDTO } from "../entity/AdminDTO";
export declare class AdminService {
    cadastrar(data: CreateAdminDTO): Promise<AdminResponseDTO>;
    login(data: LoginDTO): Promise<AuthResponseDTO>;
    validarToken(token: string): Promise<AdminResponseDTO>;
    solicitarRecuperacaoSenha(email: string): Promise<{
        mensagem: string;
    }>;
    resetarSenha(token: string, novaSenha: string): Promise<{
        mensagem: string;
    }>;
    excluir(id: number): Promise<{
        mensagem: string;
    }>;
}
//# sourceMappingURL=AdminService.d.ts.map