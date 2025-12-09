import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { RabbitMQService } from '@/services/rabbitmq/RabbitMQService';
import { ChatAuthorizationService } from '@/services/chat/ChatAuthorizationService';
import { ChatService } from '@/services/chat/ChatService';
import { GetUserService } from '@/services/users/GetUserServices';

interface SocketAuth {
    studentId: string;
    classRoomId?: string;
    classRoomName?: string;
}


const userService = new GetUserService();


export class WebSocketServer {
    private io: SocketIOServer;
    private rabbitMQ: RabbitMQService;
    private authorizationService: ChatAuthorizationService;
    private chatService: ChatService;


    constructor(httpServer: HTTPServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
            path: '/socket.io',
        });

        this.rabbitMQ = new RabbitMQService();
        this.authorizationService = new ChatAuthorizationService();
        this.chatService = new ChatService();

        this.setupRabbitMQ();
        this.setupSocketHandlers();
    }

    private async setupRabbitMQ() {
        try {
            await this.rabbitMQ.connect();
            console.log('✅ RabbitMQ configurado para WebSocket');
        } catch (error) {
            console.error('❌ Erro ao configurar RabbitMQ:', error);
        }
    }

    private setupSocketHandlers() {
        this.io.use(async (socket, next) => {
            // Middleware de autenticação
            const studentId = socket.handshake.auth?.studentId;
            const classRoomName = socket.handshake.auth?.classRoomName;

            if (!studentId) {
                return next(new Error('studentId é obrigatório'));
            }

            if (!classRoomName) {
                return next(new Error('classRoomName é obrigatório'));
            }

            // Verifica se o aluno pertence à sala
            const isAuthorized = await this.authorizationService.verifyStudentInClassRoomByName(
                studentId,
                classRoomName
            );

            if (!isAuthorized) {
                return next(new Error('Aluno não autorizado a entrar nesta sala'));
            }

            // Adiciona dados ao socket
            (socket as any).studentId = studentId;
            (socket as any).classRoomName = classRoomName;

            next();
        });

        this.io.on('connection', async (socket) => {
            const studentId = (socket as any).studentId;
            const classRoomName = (socket as any).classRoomName;

            const userData = await userService.getbyId(studentId)

            console.log(`✅ Aluno ${userData?.name} conectado à sala ${classRoomName}`);

            // Junta o socket à sala específica
            const roomName = `classroom:${classRoomName}`;
            socket.join(roomName);

            // Busca mensagens anteriores
            try {
                const messages = await this.chatService.getMessagesByClassRoomName(
                    classRoomName,
                    50
                );
                socket.emit('previous_messages', messages);
            } catch (error) {
                console.error('❌ Erro ao buscar mensagens anteriores:', error);
            }

            // Escuta novas mensagens
            socket.on('send_message', async (data: { text: string }) => {
                try {
                    // Busca o ID da sala
                    const classRooms = await this.authorizationService.getStudentClassRooms(studentId);
                    const classRoom = classRooms.find((r) => r.name === classRoomName);

                    if (!classRoom) {
                        socket.emit('error', { message: 'Sala não encontrada' });
                        return;
                    }

                    // Cria a mensagem
                    const message = await this.chatService.createMessage({
                        text: data.text,
                        studentId,
                        classRoomId: classRoom.id,
                    });

                    // Publica no RabbitMQ
                    await this.rabbitMQ.publishMessage(
                        `chat:${classRoomName}`,
                        message
                    );

                    // Envia para todos na sala
                    this.io.to(roomName).emit('new_message', message);
                } catch (error: any) {
                    console.error('❌ Erro ao enviar mensagem:', error);
                    socket.emit('error', { message: error.message });
                }
            });

            // Escuta mensagens do RabbitMQ
            this.rabbitMQ.consumeMessages(`chat:${classRoomName}`, (message) => {
                // A mensagem já foi enviada diretamente, mas podemos usar isso para logs
                console.log(`📨 Mensagem recebida do RabbitMQ para ${classRoomName}`);
            });

            socket.on('disconnect', () => {
                console.log(`❌ Aluno ${userData?.name} desconectado da sala ${classRoomName}`);
            });
        });
    }

    getIO(): SocketIOServer {
        return this.io;
    }
}

