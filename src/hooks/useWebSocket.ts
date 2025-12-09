import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Message {
    id: string;
    text: string;
    createdAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
    };
    classRoom: {
        id: string;
        name: string;
    };
}

interface UseWebSocketOptions {
    studentId: string;
    classRoomName: string;
    enabled?: boolean;
}

/**
 * Hook customizado para gerenciar conexão WebSocket com Socket.IO
 * 
 * POR QUÊ: Centraliza toda a lógica de conexão WebSocket em um único lugar.
 * Facilita reutilização e manutenção do código.
 * 
 * COMO FUNCIONA:
 * - Tenta conectar ao servidor Socket.IO quando enabled=true
 * - Envia credenciais (studentId e classRoomName) na autenticação
 * - Escuta eventos: connect, disconnect, previous_messages, new_message, error
 * - Retorna estado da conexão e função para enviar mensagens
 */
export const useWebSocket = ({ studentId, classRoomName, enabled = true }: UseWebSocketOptions) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!enabled || !studentId || !classRoomName) {
            return;
        }

        /**
         * POR QUÊ: Usa window.location.origin para pegar a URL atual.
         * Isso garante que funcione tanto em desenvolvimento quanto em produção.
         * Se não estiver no browser, usa localhost como fallback.
         */
        const wsUrl = typeof window !== 'undefined' 
            ? window.location.origin 
            : 'http://localhost:3000';
        
        /**
         * POR QUÊ: Configurações do Socket.IO:
         * - auth: Envia credenciais para o servidor validar antes de conectar
         * - path: Define o caminho onde o Socket.IO está rodando (/socket.io é o padrão)
         * - transports: Tenta WebSocket primeiro, depois polling como fallback
         * - timeout: Tempo máximo para tentar conectar (20 segundos)
         */
        const newSocket = io(wsUrl, {
            auth: {
                studentId,
                classRoomName,
            },
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            timeout: 20000,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Event listeners
        newSocket.on('connect', () => {
            console.log('✅ Conectado ao WebSocket');
            setIsConnected(true);
            setError(null);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Desconectado do WebSocket');
            setIsConnected(false);
        });

        /**
         * POR QUÊ: Trata erros de conexão de forma mais amigável.
         * Se for erro 404, significa que o servidor Socket.IO não está rodando.
         * Informa o usuário sobre isso.
         */
        /**
         * POR QUÊ: Trata erros de conexão de forma mais amigável.
         * Previne que erros não tratados quebrem a aplicação.
         */
        newSocket.on('connect_error', (err) => {
            console.error('❌ Erro de conexão:', err);
            
            // Mensagens de erro mais amigáveis
            if (err.message.includes('404') || err.message.includes('Not Found')) {
                setError('Servidor de chat não está disponível. Certifique-se de que o servidor está rodando com "npm run dev:custom"');
            } else if (err.message.includes('timeout')) {
                setError('Tempo de conexão esgotado. Verifique sua conexão com a internet.');
            } else if (err.message.includes('websocket error') || err.message.includes('Transport unknown')) {
                setError('Erro ao conectar ao servidor WebSocket. Verifique se o servidor está rodando com "npm run dev:custom"');
            } else {
                setError(`Erro de conexão: ${err.message}`);
            }
            
            setIsConnected(false);
        });

        /**
         * POR QUÊ: Trata erros de transporte WebSocket especificamente.
         * Isso previne que erros não tratados apareçam no console do navegador.
         */
        newSocket.io.on('error', (err: any) => {
            console.error('❌ Erro do Socket.IO:', err);
            if (err.type === 'TransportError') {
                setError('Erro de transporte WebSocket. Tente recarregar a página.');
            }
        });

        newSocket.on('previous_messages', (previousMessages: Message[]) => {
            setMessages(previousMessages);
        });

        newSocket.on('new_message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        newSocket.on('error', (err: { message: string }) => {
            console.error('❌ Erro do servidor:', err);
            setError(err.message);
        });

        // Cleanup
        return () => {
            newSocket.close();
            socketRef.current = null;
        };
    }, [enabled, studentId, classRoomName]);

    const sendMessage = useCallback(
        (text: string) => {
            if (socketRef.current && isConnected) {
                socketRef.current.emit('send_message', { text });
            } else {
                setError('Não conectado ao servidor');
            }
        },
        [isConnected]
    );

    return {
        socket,
        messages,
        isConnected,
        error,
        sendMessage,
    };
};

