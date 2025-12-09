/**
 * Esta API route é necessária para o Socket.IO funcionar no Next.js.
 * 
 * POR QUÊ: O Next.js não tem suporte nativo para WebSocket/Socket.IO.
 * O Socket.IO precisa de um servidor HTTP para funcionar, então criamos
 * esta rota que será usada pelo cliente Socket.IO para estabelecer a conexão.
 * 
 * COMO FUNCIONA: O Socket.IO cliente tenta conectar em /socket.io/...
 * Esta rota garante que essa conexão seja tratada corretamente.
 */

import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    // Esta rota existe apenas para garantir que o Socket.IO possa fazer handshake
    // O servidor real do Socket.IO está em src/server/websocket-server.ts
    // e é inicializado através do servidor customizado (src/server/server.ts)
    
    return new Response('Socket.IO endpoint', { status: 200 });
}

