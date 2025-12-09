import { prisma } from '@/lib/prisma';
import { ChatAuthorizationService } from './ChatAuthorizationService';

export interface CreateMessageInput {
    text: string;
    studentId: string;
    classRoomId: string;
}

export class ChatService {
    private authorizationService: ChatAuthorizationService;

    constructor() {
        this.authorizationService = new ChatAuthorizationService();
    }

    //* Cria uma nova mensagem no chat
    async createMessage(input: CreateMessageInput) {
        // Verifica se o aluno pertence à sala
        const isAuthorized = await this.authorizationService.verifyStudentInClassRoom(
            input.studentId,
            input.classRoomId
        );

        if (!isAuthorized) {
            throw new Error('Aluno não autorizado a enviar mensagens nesta sala');
        }

        const message = await prisma.message.create({
            data: {
                text: input.text,
                studentId: input.studentId,
                classId: input.classRoomId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                classRoom: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return message;
    }

    //* Busca mensagens de uma sala de aula
    async getMessagesByClassRoom(classRoomId: string, limit: number = 50) {
        const messages = await prisma.message.findMany({
            where: {
                classId: classRoomId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                classRoom: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
            take: limit,
        });

        return messages;
    }

    // * Busca mensagens de uma sala de aula pelo nome
    async getMessagesByClassRoomName(classRoomName: string, limit: number = 50) {
        const classRoom = await prisma.classRoom.findFirst({
            where: {
                name: classRoomName,
            },
        });

        if (!classRoom) {
            return [];
        }

        return this.getMessagesByClassRoom(classRoom.id, limit);
    }
}

