# ====================
#   STAGE 1: BUILDER
# ====================
FROM node:20-bullseye AS builder

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y openssl

# Copiar package.json primeiro (cache)
COPY package.json package-lock.json* ./

RUN npm ci --legacy-peer-deps || npm install

# Copiar código fonte
COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

# Criar o build do Next.js
RUN npm run build


# ====================
#   STAGE 2: RUNNER
# ====================
FROM node:20-slim AS runner

WORKDIR /app

# Copiar dependências instaladas e build do Next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expor porta
EXPOSE 3000

# CMD com migrações + seed + start
CMD npx prisma migrate deploy \
    && npm run prisma:seed \
    && npm run start
