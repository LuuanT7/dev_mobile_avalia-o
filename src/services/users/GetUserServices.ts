import { CreateUser } from '@/lib/api/users/userTypes';
import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client';

interface Filters {
    id?: string | null
    name?: string | null
    email?: string | null
    classRoom?: string | null
}

export class GetUserService {
    constructor(
        private db = prisma
    ) { }


    async getAll({ name, email, classRoom }: Filters) {


        const where: Prisma.UserWhereInput = {};
        const whereClassRooms: Prisma.ClassRoomWhereInput = {};


        if (name) {
            where.name = {
                contains: name.toLowerCase(),
            };
        }
        if (email) {
            where.email = {
                contains: email.toLowerCase(),
            };
        }
        if (classRoom) {
            whereClassRooms.name = {
                contains: classRoom.toLowerCase(),
            };
        }

        return this.db.user.findMany({ where, include: { enrollments: { include: { classRoom: true } } } });
    }


    async getbyId(id: string) {

        return this.db.user.findUnique({
            where: { id }
        });



    }

}