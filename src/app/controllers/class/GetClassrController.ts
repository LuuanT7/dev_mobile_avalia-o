// core/controllers/student.controller.ts

import { GetClassService } from "@/services/class/GetClassServices";

interface Filters {
    id?: string | null
    name?: string | null
    classRoom?: string | null
}

export class GetClassController {
    constructor(
        private getClassService: GetClassService,

    ) { }

    async getAll() {
        return this.getClassService.getAll();
    }
    // async getbyId(id: string) {
    //     return this.getUserService.getbyId(id);
    // }
}
