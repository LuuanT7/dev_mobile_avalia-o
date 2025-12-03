import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const consultants = await prisma.user.findMany({
            where: {
                userType: "CONSULTANT",
            },
            include: {
                clients: {
                    include: {
                        client: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });


        return NextResponse.json(consultants);
    } catch (error) {
        console.error("❌ Erro ao buscar consultores:", error);
        return NextResponse.json(
            { error: "Erro ao buscar consultores" },
            { status: 500 }
        );
    }
}