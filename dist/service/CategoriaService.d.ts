import { CreateCategoriaDTO, UpdateCategoriaDTO, CategoriaResponseDTO } from "../entity/CategoriaDTO";
export declare class CategoriaService {
    listarTodas(): Promise<CategoriaResponseDTO[]>;
    buscarPorId(id: number): Promise<CategoriaResponseDTO | null>;
    buscarPorNome(nome: string): Promise<CategoriaResponseDTO | null>;
    criar(categoria: CreateCategoriaDTO): Promise<CategoriaResponseDTO>;
    atualizar(id: number, categoria: UpdateCategoriaDTO): Promise<CategoriaResponseDTO>;
    excluir(id: number): Promise<{
        mensagem: string;
    }>;
}
//# sourceMappingURL=CategoriaService.d.ts.map