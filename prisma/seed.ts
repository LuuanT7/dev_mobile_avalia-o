import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco...');

    // Usuários de exemplo
    console.log('✅ Users Seed iniciando...');


    await prisma.user.createMany({
        data: [
            {
                name: "Luan Teixeira",
                email: "luan@example.com",
                user_type: "ADMIN",
                age: "35"
            },
            {
                name: "Eloa Lattanzzi",
                email: "eloa@example.com",
                user_type: "STUDENTS",
                age: "35"

            },
            {
                name: "João Almeida",
                email: "joao@example.com",
                user_type: "STUDENTS",
                age: "35",

            }
        ]
    });

    console.log('✅ ClassRooms Seed iniciando...');


    await prisma.classRoom.createMany({
        data: [
            {
                name: "Primeiro A",
                description: "Primeiro A",
                ageRange: "6-10",
            },
            {
                name: "Primeiro B",
                description: "Primeiro B",
                ageRange: "6-10",
            },
            {
                name: "Primeiro C",
                description: "Primeiro C",
                ageRange: "6-10",
            }
        ]
    });

    console.log('✅ Seed finalizada com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
