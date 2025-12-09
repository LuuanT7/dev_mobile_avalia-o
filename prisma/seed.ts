import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const schoolAges = [
    { serie: "1º ano", faixa: "6 a 7" },
    { serie: "2º ano", faixa: "7 a 8" },
    { serie: "3º ano", faixa: "8 a 9" },
    { serie: "4º ano", faixa: "9 a 10" },
    { serie: "5º ano", faixa: "10 a 11" },
    { serie: "6º ano", faixa: "11 a 12" },
    { serie: "7º ano", faixa: "12 a 13" },
    { serie: "8º ano", faixa: "13 a 14" },
    { serie: "9º ano", faixa: "14 a 15" },
    { serie: "1º EM", faixa: "15 a 16" },
    { serie: "2º EM", faixa: "16 a 17" },
    { serie: "3º EM", faixa: "17 a 18" }
];


async function main() {
    console.log('🌱 Iniciando seed do banco...');

    // Limpar todas as tabelas antes de iniciar as seeds
    console.log('🗑️ Limpando tabelas existentes...');

    // Deletar na ordem correta (respeitando foreign keys)
    await prisma.enrollment.deleteMany();
    await prisma.message.deleteMany();
    await prisma.user.deleteMany();
    await prisma.classRoom.deleteMany();

    console.log('✅ Tabelas limpas com sucesso!');

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
                name: "João Almeida",
                email: "joao@example.com",
                user_type: "STUDENTS",
                age: "35",

            }
        ]
    });

    console.log('✅ ClassRooms Seed iniciando...');


    await prisma.classRoom.createMany({
        data: schoolAges.map((item) => ({
            name: item.serie,
            ageRange: item.faixa,
            description: `Classe para alunos de ${item.faixa} anos - ${item.serie}`
        }))
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
