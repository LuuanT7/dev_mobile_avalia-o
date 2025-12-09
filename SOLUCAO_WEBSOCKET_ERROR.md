# 🔧 Solução para Erro "websocket error"

## 🐛 Problema

Erro aparecendo no frontend:
```
Unhandled Runtime Error
Error: websocket error
```

## 🔍 Causa

O problema acontecia porque o servidor HTTP estava interceptando **todas** as requisições, incluindo as do Socket.IO, antes que o Socket.IO pudesse processá-las.

**O que acontecia:**
1. Cliente tenta conectar ao Socket.IO (`/socket.io/...`)
2. Servidor intercepta a requisição no handler do Next.js
3. Next.js tenta processar a requisição do Socket.IO
4. Socket.IO não consegue fazer o upgrade HTTP → WebSocket
5. Erro "websocket error" aparece

## ✅ Solução Aplicada

### Mudança no `src/server/server.ts`

**ANTES:**
```typescript
const httpServer = createServer(async (req, res) => {
    // Todas as requisições passavam por aqui primeiro
    await handle(req, res, parsedUrl);
});

const wsServer = new WebSocketServer(httpServer);
```

**DEPOIS:**
```typescript
const httpServer = createServer(); // Sem handler

// Socket.IO é inicializado PRIMEIRO
const wsServer = new WebSocketServer(httpServer);

// Next.js handler é configurado DEPOIS
httpServer.on('request', async (req, res) => {
    await handle(req, res, parsedUrl);
});
```

**POR QUÊ funciona:**
1. Socket.IO é anexado ao servidor HTTP primeiro
2. Socket.IO automaticamente intercepta requisições `/socket.io/*`
3. Next.js só processa requisições que o Socket.IO não processou
4. WebSocket funciona corretamente!

## 🔧 Melhorias Adicionais

### 1. Tratamento de Erros Melhorado (`src/hooks/useWebSocket.ts`)

Adicionado tratamento específico para erros de WebSocket:

```typescript
newSocket.io.on('error', (err: any) => {
    if (err.type === 'TransportError') {
        setError('Erro de transporte WebSocket. Tente recarregar a página.');
    }
});
```

**POR QUÊ:**
- Previne que erros não tratados quebrem a aplicação
- Mostra mensagens mais amigáveis ao usuário

## 🚀 Como Testar

1. **Pare o servidor atual** (se estiver rodando)

2. **Inicie o servidor customizado:**
   ```bash
   npm run dev:custom
   ```

3. **Verifique os logs:**
   Você deve ver:
   ```
   > Ready on http://0.0.0.0:3000
   > WebSocket server running on ws://0.0.0.0:3000
   ✅ RabbitMQ configurado para WebSocket
   ```

4. **Teste o chat:**
   - Abra o dashboard
   - Clique em "Chat"
   - Selecione aluno e sala
   - O chat deve conectar sem erros

## ⚠️ Importante

**SEMPRE use `npm run dev:custom` para desenvolvimento!**

O `npm run dev` padrão não tem suporte a WebSocket e vai dar erro.

## 🔍 Se Ainda Der Erro

1. **Verifique se o servidor está rodando:**
   ```bash
   # Deve mostrar o processo na porta 3000
   netstat -ano | findstr :3000
   ```

2. **Verifique os logs do servidor:**
   - Deve aparecer "✅ RabbitMQ configurado"
   - Deve aparecer mensagens de conexão quando alguém entrar no chat

3. **Verifique o console do navegador:**
   - Abra DevTools (F12)
   - Vá em Console
   - Veja se há erros específicos

4. **Verifique se o RabbitMQ está rodando:**
   ```bash
   docker ps
   # Deve mostrar o container do rabbitmq
   ```

## 📝 Resumo das Mudanças

1. ✅ **`src/server/server.ts`**: Ordem de inicialização corrigida
2. ✅ **`src/hooks/useWebSocket.ts`**: Tratamento de erros melhorado

## 🎯 Resultado Esperado

Após essas mudanças:
- ✅ WebSocket conecta corretamente
- ✅ Erros são tratados de forma amigável
- ✅ Chat funciona em tempo real
- ✅ Sem erros no console do navegador

