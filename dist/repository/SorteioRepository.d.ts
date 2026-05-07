import { CreateSorteioDTO, UpdateSorteioDTO, SorteioResponseDTO, Sorteio } from "../entity/SorteioDTO";
export declare class SorteioRepository {
    listarAtivos(): Promise<SorteioResponseDTO[]>;
    listarTodos(): Promise<Sorteio[]>;
    buscarPorId(id: number): Promise<SorteioResponseDTO | null>;
    criar(sorteio: CreateSorteioDTO): Promise<SorteioResponseDTO>;
    atualizar(id: number, sorteio: UpdateSorteioDTO): Promise<SorteioResponseDTO | null>;
    excluir(id: number): Promise<boolean>;
    adicionarParticipante(sorteioId: number, nome: string, telefone: string | null): Promise<any>;
    listarParticipantes(sorteioId: number): Promise<any[]>;
    contarParticipantes(sorteioId: number): Promise<number>;
    buscarParticipanteAleatorio(sorteioId: number): Promise<any | null>;
    verificarParticipacao(sorteioId: number, nome: string, telefone: string | null): Promise<boolean>;
}
//# sourceMappingURL=SorteioRepository.d.ts.map