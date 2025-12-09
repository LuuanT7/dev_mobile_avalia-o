import { NextResponse } from 'next/server';
import { ChatService } from '@/services/chat/ChatService';

const chatService = new ChatService();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const classRoomId = searchParams.get('classRoomId');
        const classRoomName = searchParams.get('classRoomName');
        const limit = parseInt(searchParams.get('limit') || '50', 10);

        if (!classRoomId && !classRoomName) {
            return NextResponse.json(
                { error: 'classRoomId ou classRoomName é obrigatório' },
                { status: 400 }
            );
        }

        let messages;
        if (classRoomId) {
            messages = await chatService.getMessagesByClassRoom(classRoomId, limit);
        } else {
            messages = await chatService.getMessagesByClassRoomName(classRoomName!, limit);
        }

        return NextResponse.json(messages);
    } catch (error: any) {
        console.error('❌ Erro ao buscar mensagens:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao buscar mensagens' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text, studentId, classRoomId } = body;

        if (!text || !studentId || !classRoomId) {
            return NextResponse.json(
                { error: 'text, studentId e classRoomId são obrigatórios' },
                { status: 400 }
            );
        }

        const message = await chatService.createMessage({
            text,
            studentId,
            classRoomId,
        });

        return NextResponse.json(message);
    } catch (error: any) {
        console.error('❌ Erro ao criar mensagem:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao criar mensagem' },
            { status: 500 }
        );
    }
}

