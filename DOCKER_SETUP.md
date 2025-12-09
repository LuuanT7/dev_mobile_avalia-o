# 🐳 Configuração Docker - Guia Completo

## 📋 Visão Geral

Este projeto tem **duas configurações Docker**:

1. **Desenvolvimento** (`Dockerfile.dev` + `docker-compose.yml`)
   - Hot-reload ativo
   - Código montado como volume
   - Ideal para desenvolvimento

2. **Produção** (`Dockerfile` + `docker-compose.prod.yml`)
   - Build otimizado do Next.js
   - Imagem menor
   - Sem volumes (tudo dentro da imagem)

## 🚀 Desenvolvimento

### Como Usar

```bash
# Inicia todos os serviços (MySQL, RabbitMQ, Next.js)
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

### O que acontece:

1. **MySQL** inicia na porta 3306
2. **RabbitMQ** inicia nas portas 5672 (AMQP) e 15672 (Management UI)
3. **Next.js** inicia na porta 3000 com servidor customizado (WebSocket)

### Acessos:

- **Aplicação**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### Hot Reload

O código está montado como volume, então:
- ✅ Mudanças no código são refletidas automaticamente
- ✅ Não precisa rebuildar a imagem

### Parar os serviços:

```bash
docker-compose down
```

## 🏭 Produção

### Como Usar

```bash
# Build e inicia em modo produção
docker-compose -f docker-compose.prod.yml up --build -d
```

### O que acontece:

1. **Build Stage**: 
   - Instala dependências
   - Gera Prisma Client
   - **Faz build do Next.js** (pré-compilação)
   
2. **Production Stage**:
   - Cria imagem otimizada
   - Copia apenas arquivos necessários
   - Roda o servidor customizado

### Vantagens do Build de Produção:

- ✅ **Menor tamanho**: Apenas arquivos necessários
- ✅ **Mais rápido**: Next.js já está compilado
- ✅ **Mais seguro**: Usuário não-root
- ✅ **Otimizado**: Standalone output do Next.js

### Parar os serviços:

```bash
docker-compose -f docker-compose.prod.yml down
```

## 📁 Estrutura de Arquivos Docker

```
.
├── Dockerfile              # Produção (multi-stage build)
├── Dockerfile.dev          # Desenvolvimento
├── docker-compose.yml      # Desenvolvimento
├── docker-compose.prod.yml # Produção
└── .dockerignore           # Arquivos ignorados no build
```

## 🔧 Configurações Importantes

### Dockerfile.dev (Desenvolvimento)

**POR QUÊ cada parte:**

1. **`FROM node:20-alpine`**: Imagem leve do Node.js
2. **`WORKDIR /app`**: Define diretório de trabalho
3. **`RUN apk add...`**: Instala dependências do sistema
4. **`COPY package.json...`**: Copia dependências primeiro (cache do Docker)
5. **`RUN npm ci`**: Instala dependências
6. **`COPY . .`**: Copia código fonte
7. **`RUN npx prisma generate`**: Gera Prisma Client
8. **`CMD npm run dev:custom`**: Roda servidor customizado com WebSocket

### Dockerfile (Produção)

**POR QUÊ cada parte:**

1. **Stage 1 (builder)**:
   - Instala tudo
   - Gera Prisma Client
   - **Faz build do Next.js** (`npm run build`)
   
2. **Stage 2 (runner)**:
   - Copia apenas arquivos necessários
   - Cria usuário não-root (segurança)
   - Roda servidor otimizado

**POR QUÊ multi-stage:**
- Reduz tamanho final da imagem
- Remove dependências de build
- Apenas código compilado vai para produção

## 🐛 Troubleshooting

### Erro: "Cannot find module"

**Solução:**
```bash
# Rebuild a imagem
docker-compose build --no-cache
docker-compose up
```

### Erro: "Prisma Client not generated"

**Solução:**
```bash
# Entre no container e gere
docker-compose exec web npx prisma generate
```

### Erro: "WebSocket connection failed"

**Verifique:**
1. Servidor está rodando com `dev:custom`?
2. RabbitMQ está rodando? (`docker ps`)
3. Porta 3000 está livre?

### Limpar tudo e começar de novo:

```bash
# Para e remove containers, volumes, networks
docker-compose down -v

# Remove imagens
docker rmi varos-app-web varos-app-db varos-app-rabbitmq

# Rebuild
docker-compose up --build
```

## 📊 Comparação

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| Tamanho | ~500MB | ~200MB |
| Build | Não compila | Compila Next.js |
| Hot Reload | ✅ Sim | ❌ Não |
| Volumes | ✅ Sim | ❌ Não |
| Segurança | Básica | Avançada (non-root) |
| Uso | Desenvolvimento | Deploy |

## 🎯 Comandos Úteis

```bash
# Ver logs
docker-compose logs -f web

# Entrar no container
docker-compose exec web sh

# Ver processos rodando
docker ps

# Limpar cache do Docker
docker system prune -a

# Rebuild sem cache
docker-compose build --no-cache
```

## ✅ Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] Build de produção funciona (`docker-compose -f docker-compose.prod.yml build`)
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] RabbitMQ configurado
- [ ] Testes passando
- [ ] Logs configurados
- [ ] Backup do banco configurado

## 🔐 Segurança

### Produção:

1. **Usuário não-root**: Container roda como `nextjs` (não `root`)
2. **Variáveis de ambiente**: Use `.env` ou secrets do Docker
3. **Senhas**: Não commite senhas no código
4. **Portas**: Exponha apenas o necessário

### Desenvolvimento:

- Usa volumes para hot-reload
- Permissões mais abertas (OK para dev)

## 📝 Notas Importantes

1. **SEMPRE use `dev:custom`**: O servidor customizado é necessário para WebSocket
2. **Prisma precisa gerar**: Sempre rode `prisma generate` antes do build
3. **Next.js standalone**: Habilita output otimizado para Docker
4. **Healthchecks**: Garantem que serviços estão prontos antes de iniciar

## 🚀 Próximos Passos

1. Configure variáveis de ambiente em produção
2. Configure backup automático do banco
3. Configure monitoramento (logs, métricas)
4. Configure SSL/TLS para produção

