# Varos App - Next.js + Prisma + Tailwind (Docker)

## Como rodar (Docker)

1. Certifique que Docker e Docker Compose estão instalados.
2. Na raiz do projeto, rode:
   ```
   docker-compose up --build
   ```
3. A aplicação ficará disponível em http://localhost:3000
4. O banco PostgreSQL ficará exposto na porta 5432 (usuário: postgres / senha: postgres123, DB: varos_teste_db)

## Notas
- Prisma client será gerado automaticamente na inicialização do container (`npx prisma generate`).
- O esquema Prisma está em `prisma/schema.prisma`.
- Se preferir rodar localmente sem Docker:
  - configure `DATABASE_URL` no `.env`
  - `npm install`
  - `npx prisma generate`
  - `npx prisma db push`
  - `npm run dev`
