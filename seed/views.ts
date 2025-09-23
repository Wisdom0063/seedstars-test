import { PrismaClient } from '@prisma/client';
import { DEFAULT_VIEWS } from '../lib/api/views';

const prisma = new PrismaClient();

export async function seedViews() {
    console.log('🌱 Seeding views...');

    try {
        // Check if views already exist
        await prisma.view.deleteMany();



        // Create default views
        const createdViews = await Promise.all(
            DEFAULT_VIEWS.map(async (view) => {
                return await prisma.view.create({
                    data: {
                        name: view.name,
                        description: view.description,
                        isDefault: view.isDefault,
                        source: view.source,
                        layout: view.layout,
                        filters: view.filters ? JSON.stringify(view.filters) : null,
                        sortBy: view.sortBy,
                        sortOrder: view.sortOrder,
                        groupBy: view.groupBy,
                        visibleFields: view.visibleFields ? JSON.stringify(view.visibleFields) : null,
                    },
                });
            })
        );

        console.log(`✅ Created ${createdViews.length} default views:`);
        createdViews.forEach(view => {
            console.log(`   - ${view.name} (${view.layout}${view.isDefault ? ', default' : ''})`);
        });

    } catch (error) {
        console.error('❌ Error seeding views:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    seedViews()
        .then(() => {
            console.log('🎉 Views seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Views seeding failed:', error);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
