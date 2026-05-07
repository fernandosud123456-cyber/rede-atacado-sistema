import { CreateSorteioDTO, UpdateSorteioDTO, SorteioResponseDTO } from "../entity/SorteioDTO";
export declare class SorteioService {
    listarAtivos(): Promise<SorteioResponseDTO[]>;
    listarTodos(): Promise<SorteioResponseDTO[]>;
    buscarPorId(id: number): Promise<SorteioResponseDTO | null>;
    criar(sorteio: CreateSorteioDTO): Promise<SorteioResponseDTO>;
    atualizar(id: number, sorteio: UpdateSorteioDTO): Promise<SorteioResponseDTO>;
    excluir(id: number): Promise<{
        mensagem: string;
    }>;
    alterarStatus(id: number, ativo: boolean): Promise<SorteioResponseDTO>;
    ativar(id: number): Promise<SorteioResponseDTO>;
    desativar(id: number): Promise<SorteioResponseDTO>;
    adicionarParticipante(sorteioId: number, nome: string, telefone: string | null): Promise<any>;
    listarParticipantes(sorteioId: number): Promise<any[]>;
    sortearGanhador(sorteioId: number): Promise<any>;
}
//# sourceMappingURL=SorteioService.d.ts.map