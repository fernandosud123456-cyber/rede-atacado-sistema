import { Request, Response } from 'express';
export declare class EncarteController {
    private service;
    constructor();
    criar: (req: Request, res: Response) => Promise<Response>;
    listar: (req: Request, res: Response) => Promise<Response>;
    listarAtivos: (req: Request, res: Response) => Promise<Response>;
    listarFuturos: (req: Request, res: Response) => Promise<Response>;
    buscarPorId: (req: Request, res: Response) => Promise<Response>;
    atualizar: (req: Request, res: Response) => Promise<Response>;
    atualizarStatus: (req: Request, res: Response) => Promise<Response>;
    deletar: (req: Request, res: Response) => Promise<Response>;
    private handleErro;
}
//# sourceMappingURL=EncarteController.d.ts.map