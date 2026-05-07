import { Encarte, CreateEncarteDTO, UpdateEncarteDTO } from '../entity/EncarteDTO';
export declare class EncarteService {
    private supabase;
    private readonly STORAGE_BUCKET;
    constructor();
    criar(data: CreateEncarteDTO, arquivo?: Express.Multer.File): Promise<Encarte>;
    buscarTodos(filtros?: {
        ativo?: boolean;
        categoria_id?: number;
        limite?: number;
        pagina?: number;
    }): Promise<{
        data: Encarte[];
        total: number;
    }>;
    buscarPorId(id: number): Promise<Encarte>;
    atualizar(id: number, data: UpdateEncarteDTO, arquivos?: Express.Multer.File[]): Promise<Encarte>;
    deletar(id: number): Promise<void>;
    atualizarStatus(id: number, ativo: boolean): Promise<Encarte>;
    listarAtivos(categoria_id?: number): Promise<Encarte[]>;
    listarFuturos(): Promise<Encarte[]>;
    criarComImagens(data: CreateEncarteDTO, arquivos: Express.Multer.File[]): Promise<Encarte>;
    private uploadImagem;
    private deletarImagem;
}
//# sourceMappingURL=EncarteService.d.ts.map