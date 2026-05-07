"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncarteController = void 0;
const EncarteService_1 = require("../service/EncarteService");
const AppError_1 = require("../utils/AppError");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = require("../config/logger");
class EncarteController {
    constructor() {
        // ✅ CRIAR COM MÚLTIPLAS IMAGENS
        this.criar = async (req, res) => {
            try {
                const dados = {
                    titulo: req.body.titulo,
                    data_inicio: req.body.data_inicio,
                    data_fim: req.body.data_fim,
                    ativo: req.body.ativo !== undefined ? req.body.ativo === 'true' : undefined,
                    categoria_id: req.body.categoria_id ? parseInt(req.body.categoria_id) : undefined
                };
                if (dados.data_inicio && dados.data_fim) {
                    if (new Date(dados.data_fim) < new Date(dados.data_inicio)) {
                        throw new AppError_1.AppError('Data de fim não pode ser anterior à data de início', http_status_codes_1.StatusCodes.BAD_REQUEST);
                    }
                }
                // ✅ CORREÇÃO: usa req.files (array) ao invés de req.file (singular)
                const arquivos = req.files;
                if (!arquivos || arquivos.length === 0) {
                    throw new AppError_1.AppError('Pelo menos uma imagem é obrigatória', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                // ✅ Chama o método que suporta múltiplas imagens
                const encarte = await this.service.criarComImagens(dados, arquivos);
                return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    sucesso: true,
                    mensagem: 'Encarte criado com sucesso',
                    dados: encarte
                });
            }
            catch (error) {
                return this.handleErro(error, res);
            }
        };
        this.listar = async (req, res) => {
            try {
                const { ativo, categoria_id, pagina = '1', limite = '10' } = req.query;
                const filtros = {
                    ativo: ativo !== undefined ? ativo === 'true' : undefined,
                    categoria_id: categoria_id ? parseInt(categoria_id) : undefined,
                    pagina: parseInt(pagina),
                    limite: parseInt(limite)
                };
                const resultado = await this.service.buscarTodos(filtros);
                return res.json({
                    sucesso: true,
                    dados: resultado.data,
                    paginacao: {
                        pagina: filtros.pagina,
                        limite: filtros.limite,
                        total: resultado.total,
                        totalPaginas: Math.ceil(resultado.total / filtros.limite)
                    }
                });
            }
            catch (error) {
                return this.handleErro(error, res);
            }
        };
        this.listarAtivos = async (req, res) => {
            try {
                const { categoria_id } = req.query;
                const encartes = await this.service.listarAtivos(categoria_id ? parseInt(categoria_id) : undefined);
                return res.json({
                    sucesso: true,
                    dados: encartes,
                    total: encartes.length
                });
            }
            catch (error) {
                return this.handleErro(error, res);
            }
        };
        this.listarFuturos = async (req, res) => {
            try {
                const encartes = await this.service.listarFuturos();
                return res.json({
                    sucesso: true,
                    dados: encartes,
                    total: encartes.length
                });
            }
            catch (error) {
                return this.handleErro(error, res);
            }
        };
        this.buscarPorId = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    throw new AppError_1.AppError('ID inválido', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const encarte = await this.service.buscarPorId(id);
                return res.json({
                    sucesso: true,
                    dados: encarte
                });
            }
            catch (error) {
                return this.handleErro(error, res);
            }
        };
        // ✅ ATUALIZAR COM MÚLTIPLAS IMAGENS
        this.atualizar = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    throw new AppError_1.AppError('ID inválido', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const dados = {
                    titulo: req.body.titulo,
                    data_inicio: req.body.data_inicio,
                    data_fim: req.body.data_fim,
                    ativo: req.body.ativo !== undefined ? req.body.ativo === 'true' : undefined,
                    categoria_id: req.body.categoria_id ? parseInt(req.body.categoria_id) : undefined
                };
                if (dados.data_inicio && dados.data_fim) {
                    if (new Date(dados.data_fim) < new Date(dados.data_inicio)) {
                        throw new AppError_1.AppError('Data de fim não pode ser anterior à data de início', http_status_codes_1.StatusCodes.BAD_REQUEST);
                    }
                }
                // ✅ CORREÇÃO: usa req.files (array) ao invés de req.file (singular)
                const arquivos = req.files;
                // ✅ Chama o método atualizar que agora aceita array de arquivos
                const encarte = await this.service.atualizar(id, dados, arquivos);
                return res.json({
                    sucesso: true,
                    mensagem: 'Encarte atualizado com sucesso',
                    dados: encarte
                });
            }
            catch (error) {
                return this.handleErro(error, res);
            }
        };
        this.atualizarStatus = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    throw new AppError_1.AppError('ID inválido', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const { ativo } = req.body;
                if (ativo === undefined) {
                    throw new AppError_1.AppError('Campo "ativo" é obrigatório', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const encarte = await this.service.atualizarStatus(id, ativo === true || ativo === 'true');
                return res.json({
                    sucesso: true,
                    mensagem: 'Status atualizado com sucesso',
                    dados: encarte
                });
            }
            catch (error) {
                return this.handleErro(error, res);
            }
        };
        this.deletar = async (req, res) => {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    throw new AppError_1.AppError('ID inválido', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                await this.service.deletar(id);
                return res.json({
                    sucesso: true,
                    mensagem: 'Encarte deletado com sucesso'
                });
            }
            catch (error) {
                return this.handleErro(error, res);
            }
        };
        this.service = new EncarteService_1.EncarteService();
    }
    handleErro(error, res) {
        logger_1.logger.error('Erro no EncarteController:', error);
        if (error instanceof AppError_1.AppError) {
            return res.status(error.statusCode).json({
                sucesso: false,
                erro: error.message,
                codigo: error.code
            });
        }
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            sucesso: false,
            erro: 'Erro interno ao processar solicitação',
            detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
exports.EncarteController = EncarteController;
