📚 Sistema Escolar com Chat em Tempo Real

Este projeto é um sistema escolar desenvolvido em Next.js, com funcionalidades de:

Cadastro de alunos (somente permitido a usuários que possuem a senha definida no .env)

Organização de salas

Chat em tempo real para cada sala

Cada aluno só pode acessar o chat da sua sala

Back-end integrado ao MySQL via Prisma ORM

Comunicação assíncrona do chat usando WebSockets + RabbitMQ

Ambientes separados para desenvolvimento e produção, cada um com seu próprio docker-compose

🧱 Arquitetura do Projeto
Next.js (Frontend + Backend API Routes)
│
│-- Prisma ORM (MySQL)
│
│-- WebSockets (real-time)
│
│-- RabbitMQ (mensageria das salas de chat)
│
Docker
│   ├── docker-compose.dev.yml   → Ambiente Dev
│   └── docker-compose.prod.yml  → Ambiente Prod com build

🔧 Tecnologias Utilizadas

Next.js

TypeScript

Prisma ORM

MySQL

Tailwind

RabbitMQ

WebSocket

Docker & Docker Compose

🔐 Regras do Sistema
🔸 Cadastro de Alunos

O cadastro só pode ser feito por um usuário que possui a senha definida no .env:

ADMIN_KEY="sua_senha_aqui"

🔸 Chat por Sala

Cada sala possui um chat próprio.

O aluno só pode acessar o chat da sala em que está matriculado.

O chat utiliza WebSocket e a comunicação interna é gerenciada pelo RabbitMQ.

⚙️ Como rodar o projeto
🚀 Rodar LOCALMENTE (sem Docker)
1️⃣ Instalar dependências
npm install

2️⃣ Criar o arquivo .env

Crie um arquivo .env na raiz:

DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/NOME_DB"
ADMIN_KEY="senha_para_criar_alunos"

RABBITMQ_URL="amqp://localhost"

3️⃣ Subir MySQL e RabbitMQ localmente

Se preferir usar Docker apenas para os serviços:

docker compose -f docker-compose.dev.yml up -d mysql rabbitmq

4️⃣ Rodar migrações do Prisma
npx prisma migrate dev

5️⃣ Iniciar o servidor Next.js

Para usar o chat você precisa usar o comando especial:

npm run dev:custom


Esse comando inicia o Next + WebSocket + integração com RabbitMQ.

🐳 Usando DOCKER (DEV)

O ambiente de desenvolvimento já sobe tudo automaticamente:

```bash
# Inicia todos os serviços (MySQL, RabbitMQ, Next.js)
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

Isso iniciará:

Next.js em modo dev

MySQL

RabbitMQ

Prisma Client

Watchers

A aplicação ficará acessível em:
http://localhost:3000

🐳 Usando DOCKER (PROD)

O ambiente de produção já utiliza build otimizado.

Rodar:

```bash
# Build e inicia em modo produção
docker-compose -f docker-compose.prod.yml up --build -d
```

Isso irá:

Criar build otimizado do Next.js

Rodar a aplicação em modo produção

Subir MySQL

Subir RabbitMQ

Aplicação disponível em:
http://localhost:3000

🗄️ Rodando Seeds do Prisma

Se você tiver um seed configurado no package.json, rode:

npm run prisma:seed


Via Docker:
Necessario entrar no container caso não gere os dados da seed e rodar o comando:

```bash
docker exec -it <container_app> npm run prisma:seed
```

📝 Scripts Principais
Comando	Descrição
npm run dev	Inicia o Next em dev sem chat
npm run dev:custom	🔥 Inicia Next + WebSocket + RabbitMQ (chat funcionando)
npm run build	Build do Next.js
npm run start	Inicia em produção
npm run prisma:seed	Executa seeds do banco

✔️ Requisitos

Node 18+

Docker e Docker Compose

MySQL ou container MySQL

RabbitMQ local ou via Docker

Mais informações nos arquivos DOCKER_SETUP.md e CHAT_SETUP.md 