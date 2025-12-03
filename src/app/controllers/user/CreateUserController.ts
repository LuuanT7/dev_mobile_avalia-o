// core/controllers/student.controller.ts

import { CreateUser } from "@/lib/api/users/userTypes";
import { CreateUserService } from "@/services/users/CreateUserService";



export class CreateUserController {
    constructor(
        private createUserService: CreateUserService,

    ) { }

    async create({ classRoomId, name, age, email, userType, password }: CreateUser) {
        try {
            return await this.createUserService.create({
                classRoomId, name, age, email, userType, password
            });
        } catch (error) {
            console.error(error)
            throw new Error("Erro ao criar Usuário!")
        }

    }

}
