import { Empresa, EmpresaResponseDTO } from "../entity/EmpresaDTO";
export declare class EmpresaService {
    buscarDados(): Promise<EmpresaResponseDTO | null>;
    atualizar(id: number, dados: Partial<Empresa>): Promise<EmpresaResponseDTO>;
}
//# sourceMappingURL=EmpresaService.d.ts.map