// core/controllers/student.controller.ts

import { GetUserService } from "@/services/users/GetUserServices";

interface Filters {
    id?: string | null
    name?: string | null
    email?: string | null
    classRoom?: string | null
}

export class GetUserController {
    constructor(
        private getUserService: GetUserService,

    ) { }

    async getAll({ id, name, email, classRoom }: Filters) {
        return this.getUserService.getAll({
            id, name, email, classRoom
        });
    }
    async getbyId(id: string) {
        return this.getUserService.getbyId(id);
    }
}
