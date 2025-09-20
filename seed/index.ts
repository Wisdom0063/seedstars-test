import { seedCustomerSegments } from "./customer-segments";

async function main() {
    try {
        console.log('🌱 Starting to seed data...');
        await seedCustomerSegments();
        console.log('🎉 Data seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }
}

main()
    .catch((error) => {
        console.error('❌ Seed script failed:', error);
        process.exit(1);
    });