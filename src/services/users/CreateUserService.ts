import { CreateUser } from '@/lib/api/users/userTypes';
import { prisma } from '../../lib/prisma'

export class CreateUserService {
    constructor(
        private db = prisma
    ) { }

    async create({
        age, email, name, userType, classRoomId, password
    }: CreateUser) {


        if (password != process.env.ADMIN_KEY) {
            throw new Error('Somente Administradores podem criar novos usuarios')
        }

        const users = await this.db.user.create({
            data: {
                age, email, name, user_type: userType
            }
        });

        const enrollment = await this.db.enrollment.create({
            data: {
                studentId: users?.id,
                classId: classRoomId
            }
        });

        return {
            users, enrollment
        }
    }
}