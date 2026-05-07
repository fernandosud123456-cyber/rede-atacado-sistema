import { Empresa, EmpresaResponseDTO } from "../entity/EmpresaDTO";
export declare class EmpresaRepository {
    buscarDados(): Promise<EmpresaResponseDTO | null>;
    atualizar(id: number, dados: Partial<Empresa>): Promise<EmpresaResponseDTO | null>;
}
//# sourceMappingURL=EmpresaRepository.d.ts.map