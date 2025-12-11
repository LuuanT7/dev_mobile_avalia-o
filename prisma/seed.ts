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

    // -------------------------
    // LIMPEZA DO BANCO
    // -------------------------
    console.log('🗑️ Limpando tabelas...');
    await prisma.enrollment.deleteMany();
    await prisma.message.deleteMany();
    await prisma.user.deleteMany();
    await prisma.classRoom.deleteMany();
    console.log('✔️ Tabelas limpas!');

    // -------------------------
    // CRIAÇÃO DE USUÁRIOS
    // -------------------------
    console.log('👤 Criando usuários...');

    const admin = await prisma.user.create({
        data: {
            name: "Administrador",
            email: "admin@escola.com",
            user_type: "ADMIN",
            age: "35",
        }
    });

    const studentsData = [
        { name: "João Silva", email: "joao.silva@example.com", age: "12" },
        { name: "Maria Oliveira", email: "maria.oliveira@example.com", age: "14" },
        { name: "Pedro Santos", email: "pedro.santos@example.com", age: "11" },
        { name: "Ana Costa", email: "ana.costa@example.com", age: "10" },
        { name: "Lucas Rocha", email: "lucas.rocha@example.com", age: "15" },
        { name: "Laura Martins", email: "laura.martins@example.com", age: "13" },
        { name: "Carlos Pereira", email: "carlos.pereira@example.com", age: "16" },
        { name: "Julia Andrade", email: "julia.andrade@example.com", age: "17" },
    ];

    const students = await prisma.user.createMany({
        data: studentsData.map(s => ({
            name: s.name,
            email: s.email,
            user_type: "STUDENTS",
            age: s.age
        }))
    });

    console.log(`✔️ Usuários criados: 1 admin + ${studentsData.length} estudantes`);

    // Buscar usuários criados (com IDs)
    const allStudents = await prisma.user.findMany({
        where: { user_type: "STUDENTS" }
    });

    // -------------------------
    // CRIAÇÃO DAS TURMAS
    // -------------------------
    console.log('🏫 Criando turmas...');

    const createdClasses = await prisma.classRoom.createMany({
        data: schoolAges.map(item => ({
            name: item.serie,
            ageRange: item.faixa,
            description: `Classe para alunos de ${item.faixa} anos - ${item.serie}`
        }))
    });

    console.log('✔️ Turmas criadas:', createdClasses.count);

    const allClasses = await prisma.classRoom.findMany();

    // -------------------------
    // CRIAÇÃO DAS MATRÍCULAS (ENROLLMENTS)
    // -------------------------
    console.log('📚 Criando matrículas...');

    for (const student of allStudents) {
        // pegar turma random
        const classRoom = allClasses[Math.floor(Math.random() * allClasses.length)];

        await prisma.enrollment.create({
            data: {
                studentId: student.id,
                classId: classRoom.id,
            }
        });

        console.log(`   → ${student.name} matriculado em ${classRoom.name}`);
    }

    console.log('✔️ Todas as matrículas realizadas!');

    // -------------------------
    // FINALIZAÇÃO
    // -------------------------
    console.log('🎉 SEED COMPLETA COM SUCESSO!');
}

main()
    .catch((e) => {
        console.error("❌ Erro no seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
