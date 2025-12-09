# Dockerfile para PRODUÇÃO
# POR QUÊ: Otimizado com multi-stage build para reduzir tamanho da imagem
# Faz build do Next.js antes de rodar (pré-compilação)

# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências do sistema
RUN apk add --no-cache libc6-compat git

# Copia arquivos de dependências
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instala TODAS as dependências (incluindo devDependencies para build)
# POR QUÊ: Precisamos de devDependencies para fazer o build (tsx, typescript, etc)
RUN npm ci --legacy-peer-deps || npm install

# Copia todo o código fonte
COPY . .

# POR QUÊ: Gera o Prisma Client antes do build
# O Prisma precisa estar disponível durante o build do Next.js
RUN npx prisma generate

# POR QUÊ: Faz o build do Next.js (pré-compilação)
# Isso otimiza a aplicação para produção
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Define ambiente de produção
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Cria usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# POR QUÊ: Copia arquivos compilados do Next.js
# O build do Next.js gera arquivos otimizados em .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./

# POR QUÊ: Copia node_modules do builder (já tem tudo instalado)
# Isso inclui tsx que precisamos para rodar o servidor customizado
COPY --from=builder /app/node_modules ./node_modules

# POR QUÊ: Copia arquivos necessários para o servidor customizado
# O servidor customizado precisa desses arquivos TypeScript para funcionar
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./

# POR QUÊ: Mantém tsx em produção para rodar o servidor customizado TypeScript
# O servidor customizado é escrito em TypeScript e precisa ser compilado em runtime
# Alternativa seria compilar para JS no build, mas tsx é mais simples

# Ajusta permissões
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expõe a porta 3000
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# POR QUÊ: Usa o servidor customizado em produção também
# O servidor customizado é necessário para o WebSocket funcionar
# tsx compila TypeScript em runtime (mais simples que pré-compilar)
CMD ["npx", "tsx", "src/server/server.ts"]
