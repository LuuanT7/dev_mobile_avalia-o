import { CreateUser } from '@/lib/api/users/userTypes';
import { prisma } from '../../lib/prisma'

export class CreateUserService {
    constructor(
        private db = prisma
    ) { }

    /**
     * Valida se a idade do usuário está dentro do ageRange da classe
     * @param age - Idade do usuário (string)
     * @param ageRange - Faixa etária da classe (ex: "6 a 7", "15 a 16")
     * @returns true se a idade está dentro do range, false caso contrário
     */
    private validateAgeRange(age: string, ageRange: string): boolean {
        // Converter idade para número
        const userAge = parseInt(age, 10);
        
        if (isNaN(userAge)) {
            return false;
        }

        // Parse do ageRange (formato: "6 a 7" ou "15 a 16")
        // Remove espaços e divide por "a"
        const rangeParts = ageRange.toLowerCase().replace(/\s+/g, ' ').split(' a ');
        
        if (rangeParts.length !== 2) {
            console.warn(`⚠️ Formato de ageRange inválido: ${ageRange}`);
            return false;
        }

        const minAge = parseInt(rangeParts[0], 10);
        const maxAge = parseInt(rangeParts[1], 10);

        if (isNaN(minAge) || isNaN(maxAge)) {
            console.warn(`⚠️ Não foi possível parsear o ageRange: ${ageRange}`);
            return false;
        }

        // Verificar se a idade está dentro do range (inclusivo)
        return userAge >= minAge && userAge <= maxAge;
    }

    async create({
        age, email, name, userType, classRoomId, password
    }: CreateUser) {

        // Validação de senha
        if (password != process.env.ADMIN_KEY) {
            throw new Error('Somente Administradores podem criar novos usuarios')
        }

        // Verificar se a classe existe
        const classRoom = await this.db.classRoom.findUnique({
            where: { id: classRoomId }
        });

        if (!classRoom) {
            throw new Error(`Classe com ID ${classRoomId} não encontrada`)
        }

        // Validar se a idade do usuário está dentro do ageRange da classe
        const isAgeValid = this.validateAgeRange(age, classRoom.ageRange);
        
        if (!isAgeValid) {
            throw new Error(
                `A idade ${age} anos não está dentro da faixa etária permitida para a classe "${classRoom.name}" (${classRoom.ageRange} anos)`
            );
        }

        console.log(`✅ Validação de idade: ${age} anos está dentro do range ${classRoom.ageRange} da classe ${classRoom.name}`);

        console.log('📝 Criando usuário e enrollment em transação...');
        console.log('📋 Dados:', { name, email, age, userType, classRoomId });

        // Usar transação para garantir atomicidade
        const result = await this.db.$transaction(async (tx) => {
            // Criar usuário
            const users = await tx.user.create({
                data: {
                    age, email, name, user_type: userType
                }
            });

            console.log('✅ Usuário criado:', users.id);

            // Verificar se já existe enrollment (por segurança, embora não deveria existir)
            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    studentId_classId: {
                        studentId: users.id,
                        classId: classRoomId
                    }
                }
            });

            if (existingEnrollment) {
                throw new Error('Enrollment já existe para este usuário e classe');
            }

            // Criar enrollment
            const enrollment = await tx.enrollment.create({
                data: {
                    studentId: users.id,
                    classId: classRoomId
                },
                include: {
                    classRoom: true,
                    user: true
                }
            });

            console.log('✅ Enrollment criado:', enrollment.id);
            console.log('📊 Enrollment completo:', JSON.stringify(enrollment, null, 2));

            // Buscar usuário com enrollments para retornar dados completos
            const userWithEnrollments = await tx.user.findUnique({
                where: { id: users.id },
                include: {
                    enrollments: {
                        include: {
                            classRoom: true
                        }
                    }
                }
            });

            return {
                users: userWithEnrollments,
                enrollment
            };
        });

        console.log('✅ Transação concluída com sucesso');
        return result;
    }
}