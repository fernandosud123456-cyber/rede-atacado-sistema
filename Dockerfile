FROM node:20-alpine

WORKDIR /app

# Instala dependências primeiro para melhor caching
COPY package.json package-lock.json* ./
RUN npm ci --only=production

COPY . .

# Build apenas se necessário
RUN npm run build || true

EXPOSE 3000

# Railway precisa deste healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
