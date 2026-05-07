"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPool = void 0;
exports.testConnection = testConnection;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Validação das variáveis de ambiente - tornamso opcional para ambiente sem BD
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const hasDbConfig = requiredEnvVars.every(envVar => process.env[envVar]);
let pool = null;
if (hasDbConfig) {
    pool = new pg_1.Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    pool.on('connect', () => {
        console.log('✅ Nova conexão estabelecida com o banco de dados');
    });
    pool.on('error', (err) => {
        console.error('❌ Erro inesperado no pool do banco de dados:', err);
    });
}
exports.dbPool = pool;
// Função para testar a conexão ao iniciar
async function testConnection() {
    if (!exports.dbPool) {
        console.warn('⚠️ Banco de dados não configurado');
        return;
    }
    try {
        const client = await exports.dbPool.connect();
        console.log('🟢 Banco de dados conectado e pronto!');
        client.release();
    }
    catch (err) {
        console.error('🔴 Falha ao conectar no banco de dados:', err);
    }
}
