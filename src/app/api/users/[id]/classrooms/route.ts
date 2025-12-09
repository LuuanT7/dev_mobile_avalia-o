import { NextResponse } from 'next/server';
import { ChatAuthorizationService } from '@/services/chat/ChatAuthorizationService';

const authorizationService = new ChatAuthorizationService();

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const classRooms = await authorizationService.getStudentClassRooms(id);
        return NextResponse.json(classRooms);
    } catch (error: any) {
        console.error('❌ Erro ao buscar salas do aluno:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao buscar salas do aluno' },
            { status: 500 }
        );
    }
}

