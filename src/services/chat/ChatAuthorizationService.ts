import { prisma } from '@/lib/prisma';

export class ChatAuthorizationService {

    // Verifica se um aluno pertence a uma sala de aula específica
    async verifyStudentInClassRoom(
        studentId: string,
        classRoomId: string
    ): Promise<boolean> {
        try {
            const enrollment = await prisma.enrollment.findFirst({
                where: {
                    studentId,
                    classId: classRoomId,
                },
            });

            return !!enrollment;
        } catch (error) {
            console.error('❌ Erro ao verificar autorização:', error);
            return false;
        }
    }

    // * Verifica se um aluno pertence a uma sala de aula pelo nome da sala
    async verifyStudentInClassRoomByName(
        studentId: string,
        classRoomName: string
    ): Promise<boolean> {
        try {
            const enrollment = await prisma.enrollment.findFirst({
                where: {
                    studentId,
                    classRoom: {
                        name: classRoomName,
                    },
                },
                include: {
                    classRoom: true,
                },
            });

            return !!enrollment;
        } catch (error) {
            console.error('❌ Erro ao verificar autorização por nome:', error);
            return false;
        }
    }

    // * Obtém todas as salas de aula de um aluno
    async getStudentClassRooms(studentId: string) {
        try {
            const enrollments = await prisma.enrollment.findMany({
                where: {
                    studentId,
                },
                include: {
                    classRoom: true,
                },
            });

            return enrollments.map((e) => e.classRoom);
        } catch (error) {
            console.error('❌ Erro ao buscar salas do aluno:', error);
            return [];
        }
    }
}

