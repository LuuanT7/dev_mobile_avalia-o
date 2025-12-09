# Sistema de Chat com WebSocket e RabbitMQ

## 📋 Visão Geral

Este sistema implementa um chat em tempo real usando WebSocket (Socket.IO) e RabbitMQ para mensageria. Cada sala de aula tem sua própria sala de chat, e apenas alunos pertencentes àquela sala podem acessar.

## 🏗️ Arquitetura

### Componentes Principais:

1. **Servidor WebSocket** (`src/server/websocket-server.ts`)
   - Gerencia conexões Socket.IO
   - Autentica alunos antes de permitir acesso à sala
   - Publica mensagens no RabbitMQ

2. **Serviços**:
   - `ChatService`: Gerencia criação e busca de mensagens
   - `ChatAuthorizationService`: Verifica se aluno pertence à sala
   - `RabbitMQService`: Gerencia conexão e publicação no RabbitMQ

3. **Frontend**:
   - `ChatModal`: Componente de chat em tempo real
   - `useWebSocket`: Hook customizado para gerenciar conexão WebSocket

## 🚀 Como Usar

### 1. Configuração do Ambiente

Adicione as seguintes variáveis de ambiente (ou configure no `docker-compose.yml`):

```env
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

### 2. Iniciar os Serviços

```bash
# Inicia MySQL e RabbitMQ
docker-compose up -d db rabbitmq

# Inicia o servidor Next.js com WebSocket
npm run dev:custom
```

**Nota**: Você precisará criar um script `dev:custom` no `package.json` que use o servidor customizado:

```json
{
  "scripts": {
    "dev:custom": "tsx src/server/server.ts"
  }
}
```

### 3. Usar o Chat

1. No dashboard, clique em "Abrir Chat" ao lado de um aluno
2. Selecione a sala de aula no dropdown
3. O sistema verificará automaticamente se o aluno pertence àquela sala
4. Comece a conversar!

## 🔐 Segurança

- **Autorização**: Antes de conectar, o sistema verifica se o aluno pertence à sala de aula
- **Isolamento**: Cada sala de aula tem sua própria "room" no Socket.IO
- **Validação**: Mensagens são validadas antes de serem salvas no banco

## 📡 Fluxo de Mensagens

1. Cliente envia mensagem via WebSocket
2. Servidor valida autorização do aluno
3. Mensagem é salva no banco de dados
4. Mensagem é publicada no RabbitMQ
5. Mensagem é broadcastada para todos na sala via WebSocket

## 🐛 Troubleshooting

### RabbitMQ não conecta
- Verifique se o container está rodando: `docker ps`
- Verifique as credenciais em `RABBITMQ_URL`

### WebSocket não conecta
- Verifique se o servidor customizado está rodando
- Verifique se a URL está correta no hook `useWebSocket`

### Aluno não consegue entrar na sala
- Verifique se o aluno tem um `enrollment` naquela sala de aula
- Verifique os logs do servidor para erros de autorização

## 📝 Notas Importantes

- O servidor customizado (`src/server/server.ts`) precisa ser usado em vez do servidor padrão do Next.js para suportar WebSocket
- Em produção, considere usar um servidor separado para WebSocket ou usar serviços como Pusher/Socket.io Cloud
- O RabbitMQ é usado para garantir que mensagens sejam processadas mesmo se houver múltiplas instâncias do servidor

