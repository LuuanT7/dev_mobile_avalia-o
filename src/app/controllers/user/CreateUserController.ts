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
            console.error('Erro detalhado:', error);
            // Se o erro já é uma instância de Error, re-lança com a mensagem original
            if (error instanceof Error) {
                throw error;
            }
            // Caso contrário, lança um erro genérico
            throw new Error("Erro ao criar Usuário!")
        }

    }

}
