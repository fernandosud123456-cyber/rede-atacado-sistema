import { CreateEncarteDTO, UpdateEncarteDTO, EncarteResponseDTO, EncarteAtivoDTO } from "../entity/EncarteDTO";
export declare class EncarteRepository {
    listarAtivos(): Promise<EncarteAtivoDTO[]>;
    buscarPorId(id: number): Promise<EncarteResponseDTO | null>;
    listarTodos(): Promise<EncarteResponseDTO[]>;
    criar(encarte: CreateEncarteDTO): Promise<EncarteResponseDTO>;
    atualizar(id: number, encarte: UpdateEncarteDTO): Promise<EncarteResponseDTO | null>;
    excluir(id: number): Promise<boolean>;
    desativarExpirados(): Promise<number>;
    buscarPorCategoria(categoriaId: number): Promise<any[]>;
    listarFuturos(): Promise<EncarteResponseDTO[]>;
}
//# sourceMappingURL=EncarteRepository.d.ts.map