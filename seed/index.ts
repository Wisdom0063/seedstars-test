import { PrismaClient } from '@prisma/client';
import { seedCustomerSegments } from "./customer-segments";
import { seedViews } from "./views";
import { seedValuePropositions } from "./value-proposition";
import { seedBusinessModels } from "./business-model";

const prisma = new PrismaClient();

async function clearAllData() {
    console.log('🧹 Clearing all existing data...');
    await prisma.valuePropositionStatement.deleteMany();
    await prisma.customerJob.deleteMany();
    await prisma.customerPain.deleteMany();
    await prisma.gainCreator.deleteMany();
    await prisma.painReliever.deleteMany();
    await prisma.productService.deleteMany();
    await prisma.valueProposition.deleteMany();

    await prisma.persona.deleteMany();
    await prisma.customerSegment.deleteMany();

    await prisma.view.deleteMany();

    console.log('✅ All data cleared successfully');
}

async function main() {
    try {
        console.log('🌱 Starting to seed data...');
        await clearAllData();
        await seedCustomerSegments();
        await seedValuePropositions();
        await seedBusinessModels();
        await seedViews();

        console.log('🎉 Data seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error('❌ Seed script failed:', error);
        process.exit(1);
    });