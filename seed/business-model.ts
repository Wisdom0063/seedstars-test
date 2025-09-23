import { PrismaClient } from '@prisma/client';
import Bluebird from 'bluebird';

const prisma = new PrismaClient();

// Business Model Canvas components
const keyPartnersPool = [
    "Industry associations and professional bodies",
    "Educational institutions and universities",
    "Technology providers and platform partners",
    "Content creators and subject matter experts",
    "Certification bodies and accreditation organizations",
    "Corporate training departments",
    "Career coaching and consulting firms",
    "Learning management system providers",
    "Professional networking platforms",
    "Recruitment and staffing agencies",
    "Industry conferences and event organizers",
    "Government workforce development programs",
    "Online learning marketplaces",
    "Professional development consultants",
    "Employer partnerships and corporate clients"
];

const keyActivitiesPool = [
    "Content creation and curriculum development",
    "Platform development and maintenance",
    "Instructor recruitment and training",
    "Student support and community management",
    "Quality assurance and content review",
    "Marketing and customer acquisition",
    "Partnership development and management",
    "Technology infrastructure management",
    "Data analytics and learning insights",
    "Certification and assessment programs",
    "Customer success and retention programs",
    "Research and development of new features",
    "Brand building and thought leadership",
    "Sales and business development",
    "Financial management and operations"
];

const keyResourcesPool = [
    "Learning management system and platform",
    "Content library and educational resources",
    "Expert instructors and mentors",
    "Technology infrastructure and servers",
    "Brand reputation and market presence",
    "Student community and network",
    "Proprietary learning methodologies",
    "Data and learning analytics capabilities",
    "Customer relationships and partnerships",
    "Intellectual property and course materials",
    "Development team and technical expertise",
    "Marketing channels and customer acquisition",
    "Financial resources and funding",
    "Operational processes and systems",
    "Quality assurance and certification programs"
];

const customerRelationshipsPool = [
    "Personal assistance and dedicated support",
    "Self-service learning platform",
    "Automated learning recommendations",
    "Community-driven peer support",
    "One-on-one mentorship programs",
    "Group coaching and cohort learning",
    "24/7 technical support",
    "Regular progress check-ins",
    "Gamified learning experiences",
    "Social learning and collaboration tools",
    "Personalized learning paths",
    "Expert-led live sessions",
    "Career guidance and counseling",
    "Alumni network and ongoing support",
    "Corporate account management"
];

const channelsPool = [
    "Direct online platform and website",
    "Mobile applications (iOS and Android)",
    "Social media marketing and content",
    "Search engine optimization and marketing",
    "Partner referrals and affiliates",
    "Corporate sales and B2B channels",
    "Content marketing and thought leadership",
    "Email marketing and newsletters",
    "Webinars and online events",
    "Industry conferences and trade shows",
    "Influencer partnerships and endorsements",
    "Paid advertising (Google, Facebook, LinkedIn)",
    "Public relations and media coverage",
    "Word-of-mouth and customer referrals",
    "Educational institution partnerships"
];

const customerSegmentsPool = [
    "Early-career professionals seeking skill development",
    "Mid-career professionals looking for advancement",
    "Career changers transitioning to new fields",
    "Corporate teams needing upskilling",
    "Freelancers and independent contractors",
    "Recent graduates entering the workforce",
    "Senior professionals seeking leadership skills",
    "Entrepreneurs and small business owners",
    "Remote workers needing digital skills",
    "Industry-specific professionals (tech, finance, etc.)",
    "Students preparing for career entry",
    "Professionals seeking certifications",
    "Managers developing leadership capabilities",
    "Consultants expanding their expertise",
    "International professionals improving skills"
];

const costStructurePool = [
    "Technology infrastructure and hosting costs",
    "Content development and creation expenses",
    "Instructor payments and compensation",
    "Marketing and customer acquisition costs",
    "Platform development and maintenance",
    "Customer support and success operations",
    "Administrative and operational overhead",
    "Partnership and affiliate commissions",
    "Data storage and analytics tools",
    "Quality assurance and content review",
    "Legal and compliance expenses",
    "Office space and facilities (if applicable)",
    "Professional development and training",
    "Insurance and risk management",
    "Research and development investments"
];

const revenueStreamsPool = [
    "Monthly subscription fees",
    "Annual membership plans",
    "Pay-per-course pricing model",
    "Corporate training contracts",
    "Certification program fees",
    "Premium mentorship services",
    "Enterprise licensing deals",
    "Affiliate marketing commissions",
    "Sponsored content and partnerships",
    "Job placement and recruitment fees",
    "Consulting and custom training services",
    "Mobile app premium features",
    "Certification and assessment fees",
    "Community membership tiers",
    "White-label platform licensing"
];

const businessModelTags = [
    "EdTech", "Professional Development", "Online Learning", "Skill Building",
    "Career Advancement", "Digital Education", "Workforce Development", "Training",
    "Certification", "Mentorship", "Community Learning", "B2B", "B2C", "SaaS",
    "Marketplace", "Platform", "Subscription", "Enterprise", "Mobile Learning"
];

const businessModelNotes = [
    "Focus on practical, hands-on learning experiences that directly apply to real-world scenarios",
    "Emphasis on building strong community connections between learners and industry professionals",
    "Scalable platform designed to accommodate both individual learners and corporate clients",
    "Data-driven approach to personalize learning paths and optimize student outcomes",
    "Strong focus on measurable skill development and career advancement metrics",
    "Integration with industry standards and certification requirements for maximum credibility",
    "Flexible pricing models to accommodate different market segments and budget constraints",
    "Continuous content updates to stay current with rapidly evolving industry trends",
    "Multi-modal learning approach combining video, interactive exercises, and live sessions",
    "Strong emphasis on learner support and success through dedicated coaching and mentorship"
];

// Helper function to get random items from array
function getRandomItems<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
}

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

// Generate business models for value proposition statements
function generateBusinessModels(valuePropositionStatements: any[], batchSize: number = 1000) {
    console.log(`🏢 Generating business models for ${valuePropositionStatements.length} value proposition statements in batches of ${batchSize}...`);

    const batches = Math.ceil(valuePropositionStatements.length / batchSize);
    let totalGenerated = 0;

    const allBusinessModels = Array.from({ length: batches }, (_, batchIndex) => {
        const startIndex = batchIndex * batchSize;
        const endIndex = Math.min(startIndex + batchSize, valuePropositionStatements.length);
        const currentBatchStatements = valuePropositionStatements.slice(startIndex, endIndex);

        const batch = currentBatchStatements.map((vpStatement, index) => {
            // Generate business model canvas components (3-6 items each)
            const keyPartners = getRandomItems(keyPartnersPool, 3, 6);
            const keyActivities = getRandomItems(keyActivitiesPool, 4, 7);
            const keyResources = getRandomItems(keyResourcesPool, 3, 6);
            const customerRelationships = getRandomItems(customerRelationshipsPool, 2, 5);
            const channels = getRandomItems(channelsPool, 3, 7);
            const customerSegments = getRandomItems(customerSegmentsPool, 2, 4);
            const costStructure = getRandomItems(costStructurePool, 4, 8);
            const revenueStreams = getRandomItems(revenueStreamsPool, 2, 5);

            // Generate tags and notes
            const tags = getRandomItems(businessModelTags, 3, 7);
            const notes = Math.random() > 0.3 ? getRandomItem(businessModelNotes) : null;

            return {
                valuePropositionStatementId: vpStatement.id,
                keyPartners: JSON.stringify(keyPartners),
                keyActivities: JSON.stringify(keyActivities),
                keyResources: JSON.stringify(keyResources),
                customerRelationships: JSON.stringify(customerRelationships),
                channels: JSON.stringify(channels),
                customerSegments: JSON.stringify(customerSegments),
                costStructure: JSON.stringify(costStructure),
                revenueStreams: JSON.stringify(revenueStreams),
                tags: JSON.stringify(tags),
                notes
            };
        });

        totalGenerated += batch.length;
        console.log(`✅ Generated batch ${batchIndex + 1}/${batches} (${totalGenerated}/${valuePropositionStatements.length} business models)`);

        return batch;
    }).flat();

    console.log(`🎉 Generated ${allBusinessModels.length} business models successfully!`);
    return allBusinessModels;
}

export async function seedBusinessModels() {
    try {
        console.log('🌱 Starting to seed business models...');

        // Clear existing business model data
        console.log('🧹 Clearing existing business model data...');
        await prisma.businessModel.deleteMany();

        // Fetch all value proposition statements
        console.log('🎯 Fetching value proposition statements...');
        const valuePropositionStatements = await prisma.valuePropositionStatement.findMany({
            include: {
                valueProposition: {
                    include: {
                        segment: true,
                        persona: true
                    }
                }
            }
        });

        if (valuePropositionStatements.length === 0) {
            throw new Error('No value proposition statements found. Please run the value propositions seed first.');
        }

        console.log(`📊 Found ${valuePropositionStatements.length} value proposition statements to create business models for`);

        // Generate business models (create 1 business model per 2-3 value proposition statements)
        const selectedStatements = valuePropositionStatements.filter((_, index) => index % 2 === 0 || Math.random() > 0.5);
        console.log(`🎲 Selected ${selectedStatements.length} value proposition statements for business model creation`);

        console.log('🏢 Generating business models...');
        const businessModels = generateBusinessModels(selectedStatements);

        console.log('💾 Creating business models with Bluebird concurrency control...');
        const concurrency = 10; // Process 10 business models concurrently
        let completed = 0;

        await Bluebird.map(businessModels, async (bmData: any) => {
            const createdBM = await prisma.businessModel.create({
                data: bmData
            });

            completed++;

            // Log progress every 50 business models
            if (completed % 50 === 0) {
                console.log(`✅ Created ${completed}/${businessModels.length} business models`);
            }

            return createdBM;
        }, { concurrency });

        console.log(`✅ All ${completed} business models created successfully!`);

        console.log('🎉 Business model seeding completed successfully!');

        // Display summary
        const bmCount = await prisma.businessModel.count();
        const withNotesCount = await prisma.businessModel.count({ where: { notes: { not: null } } });
        const withTagsCount = await prisma.businessModel.count({ where: { tags: { not: null } } });

        console.log(`📈 Summary:`);
        console.log(`   • ${bmCount} business models created`);
        console.log(`   • ${withNotesCount} business models with notes`);
        console.log(`   • ${withTagsCount} business models with tags`);

    } catch (error) {
        console.error('❌ Error seeding business models:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}