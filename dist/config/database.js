"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.testConnection = testConnection;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Validação das variáveis de ambiente
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`❌ Variável de ambiente ausente: ${envVar}`);
    }
}
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20, // Máximo de conexões simultâneas
    idleTimeoutMillis: 30000, // Fecha conexões ociosas após 30s
    connectionTimeoutMillis: 2000, // Timeout de conexão (2s)
});
// Listener de sucesso na conexão
exports.pool.on('connect', () => {
    console.log('✅ Nova conexão estabelecida com o banco de dados');
});
// Listener de erros
exports.pool.on('error', (err) => {
    console.error('❌ Erro inesperado no pool do banco de dados:', err);
    process.exit(-1); // Encerra o processo para evitar comportamento estranho
});
// Função para testar a conexão ao iniciar
async function testConnection() {
    try {
        const client = await exports.pool.connect();
        console.log('🟢 Banco de dados conectado e pronto!');
        client.release();
    }
    catch (err) {
        console.error('🔴 Falha ao conectar no banco de dados:', err);
        throw err;
    }
}
//# sourceMappingURL=database.js.map