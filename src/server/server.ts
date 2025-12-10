import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer } from './websocket-server';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer();

    /**
     * POR QUÊ: Inicializa o servidor WebSocket ANTES de configurar o handler do Next.js.
     * O Socket.IO precisa estar anexado ao servidor HTTP primeiro para poder interceptar
     * suas próprias requisições (/socket.io/*) antes que sejam passadas para o Next.js.
     */
    const wsServer = new WebSocketServer(httpServer);

    /**
     * POR QUÊ: Configura o handler do Next.js DEPOIS do Socket.IO.
     * Isso garante que o Socket.IO processe suas requisições primeiro.
     * O Socket.IO automaticamente ignora requisições que não são dele.
     */
    httpServer.on('request', async (req, res) => {
        try {
            const parsedUrl = parse(req.url!, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
        console.log(`> WebSocket server running on ws://${hostname}:${port}`);
    });
});

