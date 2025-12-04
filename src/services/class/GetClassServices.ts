import { CreateUser } from '@/lib/api/users/userTypes';
import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client';

interface Filters {
    id?: string | null
    name?: string | null
    email?: string | null
    classRoom?: string | null
}

export class GetClassService {
    constructor(
        private db = prisma
    ) { }


    async getAll() {




        return this.db.classRoom.findMany();
    }


    // async getbyId(id: string) {

    //     return this.db.user.findUnique({
    //         where: { id }
    //     });



    // }

}