import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
    try {
        console.log('🧹 Clearing all database data...');
        await prisma.valuePropositionStatement.deleteMany();
        await prisma.customerJob.deleteMany();
        await prisma.customerPain.deleteMany();
        await prisma.gainCreator.deleteMany();
        await prisma.painReliever.deleteMany();
        await prisma.productService.deleteMany();
        await prisma.valueProposition.deleteMany();

        await prisma.businessModel.deleteMany();
        await prisma.persona.deleteMany();
        await prisma.customerSegment.deleteMany();

        await prisma.view.deleteMany();

        console.log('✅ Database cleared successfully');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase()
    .catch((error) => {
        console.error('❌ Clear database script failed:', error);
        process.exit(1);
    });
