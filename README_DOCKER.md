# 🐳 Quick Start - Docker

## 🚀 Desenvolvimento (Recomendado)

```bash
# Inicia tudo (MySQL, RabbitMQ, Next.js com WebSocket)
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

**Acessos:**
- App: http://localhost:3000
- RabbitMQ UI: http://localhost:15672 (guest/guest)

## 🏭 Produção

```bash
# Build otimizado e inicia
docker-compose -f docker-compose.prod.yml up --build -d
```

## 📋 O que foi criado:

1. **`Dockerfile.dev`** - Desenvolvimento com hot-reload
2. **`Dockerfile`** - Produção com build do Next.js
3. **`docker-compose.yml`** - Desenvolvimento
4. **`docker-compose.prod.yml`** - Produção
5. **`.dockerignore`** - Otimiza build

## ⚡ Comandos Rápidos

```bash
# Ver logs
docker-compose logs -f web

# Parar tudo
docker-compose down

# Limpar tudo
docker-compose down -v
```

Veja `DOCKER_SETUP.md` para documentação completa!

