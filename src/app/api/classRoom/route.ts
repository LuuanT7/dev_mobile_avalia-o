import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetClassService } from "@/services/class/GetClassServices";
import { GetClassController } from "@/app/controllers/class/GetClassrController";

const getClassService = new GetClassService();
const getClassController = new GetClassController(getClassService);

export async function GET() {
    try {
        const data = await getClassController.getAll();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro na rota GET /api/classRoom:", error);
        const message = error instanceof Error ? error.message : "Erro desconhecido ao buscar classes";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}