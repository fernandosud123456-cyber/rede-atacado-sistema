import { CreateCategoriaDTO, UpdateCategoriaDTO, CategoriaResponseDTO } from "../entity/CategoriaDTO";
export declare class CategoriaRepository {
    listarTodas(): Promise<CategoriaResponseDTO[]>;
    buscarPorId(id: number): Promise<CategoriaResponseDTO | null>;
    buscarPorNome(nome: string): Promise<CategoriaResponseDTO | null>;
    criar(categoria: CreateCategoriaDTO): Promise<CategoriaResponseDTO>;
    atualizar(id: number, categoria: UpdateCategoriaDTO): Promise<CategoriaResponseDTO | null>;
    excluir(id: number): Promise<boolean>;
}
//# sourceMappingURL=CategoriaRepository.d.ts.map