import { PrismaClient } from '@prisma/client';
import Bluebird from 'bluebird';

const prisma = new PrismaClient();
const valuePropositionOfferings = [
    "Provide interactive learning experiences",
    "Deliver personalized skill development",
    "Offer flexible scheduling options",
    "Create community-driven learning",
    "Enable micro-learning sessions",
    "Facilitate peer-to-peer mentoring",
    "Provide industry-specific training",
    "Offer certification programs",
    "Create hands-on project experiences",
    "Deliver expert-led workshops",
    "Provide career transition support",
    "Offer affordable learning solutions",
    "Create mobile-first learning",
    "Facilitate networking opportunities",
    "Provide real-world case studies"
];

const valuePropositionDescriptions = [
    "Through engaging and interactive content that keeps learners motivated",
    "By adapting to individual learning styles and career goals",
    "With on-demand access that fits busy lifestyles",
    "Through collaborative learning environments and peer support",
    "Using bite-sized content that maximizes retention",
    "By connecting learners with experienced professionals",
    "Tailored to specific industry requirements and trends",
    "With recognized credentials that boost career prospects",
    "Through practical application of learned concepts",
    "Led by industry experts and thought leaders",
    "With structured guidance for career pivots",
    "At accessible price points for all learners",
    "Optimized for learning on-the-go",
    "By building professional relationships and connections",
    "Using real business scenarios and challenges"
];

const customerJobsPool = [
    {
        title: "Develop foundational skills for career entry",
        description: "Build essential competencies required for entry-level positions in chosen field",
        importance: "VERY_IMPORTANT",
        category: "FUNCTIONAL"
    },
    {
        title: "Stay current with industry trends",
        description: "Keep up-to-date with latest developments and best practices in the industry",
        importance: "FAIRLY_IMPORTANT",
        category: "FUNCTIONAL"
    },
    {
        title: "Advance to leadership positions",
        description: "Develop management and leadership skills for career progression",
        importance: "VERY_IMPORTANT",
        category: "FUNCTIONAL"
    },
    {
        title: "Build professional network",
        description: "Connect with peers and industry professionals for career opportunities",
        importance: "FAIRLY_IMPORTANT",
        category: "SOCIAL"
    },
    {
        title: "Gain practical experience",
        description: "Apply theoretical knowledge in real-world scenarios and projects",
        importance: "VERY_IMPORTANT",
        category: "FUNCTIONAL"
    },
    {
        title: "Earn industry certifications",
        description: "Obtain recognized credentials that validate expertise and skills",
        importance: "FAIRLY_IMPORTANT",
        category: "FUNCTIONAL"
    },
    {
        title: "Balance learning with work",
        description: "Manage professional development alongside current job responsibilities",
        importance: "VERY_IMPORTANT",
        category: "EMOTIONAL"
    },
    {
        title: "Learn at own pace",
        description: "Progress through learning materials at a comfortable and sustainable speed",
        importance: "FAIRLY_IMPORTANT",
        category: "EMOTIONAL"
    }
];

const customerPainsPool = [
    {
        title: "Limited time for learning",
        description: "Struggling to find adequate time for skill development due to work and personal commitments",
        severity: "EXTREME_PAIN",
        category: "OBSTACLES"
    },
    {
        title: "High cost of quality education",
        description: "Quality learning resources and programs are often expensive and unaffordable",
        severity: "MODERATE_PAIN",
        category: "OBSTACLES"
    },
    {
        title: "Lack of personalized guidance",
        description: "Generic learning paths don't address individual career goals and learning styles",
        severity: "MODERATE_PAIN",
        category: "UNDESIRED_OUTCOMES"
    },
    {
        title: "Information overload",
        description: "Too many learning options make it difficult to choose the right path",
        severity: "MODERATE_PAIN",
        category: "UNDESIRED_OUTCOMES"
    },
    {
        title: "No practical application",
        description: "Learning materials are too theoretical without real-world application opportunities",
        severity: "EXTREME_PAIN",
        category: "UNDESIRED_OUTCOMES"
    },
    {
        title: "Isolation in learning journey",
        description: "Learning alone without community support or peer interaction",
        severity: "MODERATE_PAIN",
        category: "RISKS"
    },
    {
        title: "Outdated content",
        description: "Learning materials don't reflect current industry practices and technologies",
        severity: "EXTREME_PAIN",
        category: "UNDESIRED_OUTCOMES"
    },
    {
        title: "Lack of accountability",
        description: "No structure or support system to maintain learning momentum and consistency",
        severity: "MODERATE_PAIN",
        category: "RISKS"
    }
];

const gainCreatorsPool = [
    {
        title: "Flexible scheduling system",
        description: "Learn anytime, anywhere with on-demand access to all content and resources",
        priority: "VERY_ESSENTIAL",
        category: "REQUIRED_GAINS"
    },
    {
        title: "Personalized learning paths",
        description: "AI-powered recommendations based on career goals, learning style, and progress",
        priority: "VERY_ESSENTIAL",
        category: "EXPECTED_GAINS"
    },
    {
        title: "Interactive community platform",
        description: "Connect with peers, mentors, and industry experts for support and networking",
        priority: "FAIRLY_ESSENTIAL",
        category: "DESIRED_GAINS"
    },
    {
        title: "Hands-on project portfolio",
        description: "Build real-world projects that demonstrate skills to potential employers",
        priority: "VERY_ESSENTIAL",
        category: "REQUIRED_GAINS"
    },
    {
        title: "Industry-recognized certifications",
        description: "Earn credentials that are valued and recognized by employers in your field",
        priority: "FAIRLY_ESSENTIAL",
        category: "EXPECTED_GAINS"
    },
    {
        title: "Progress tracking dashboard",
        description: "Visual analytics showing learning progress, achievements, and skill development",
        priority: "FAIRLY_ESSENTIAL",
        category: "DESIRED_GAINS"
    },
    {
        title: "Expert mentorship program",
        description: "One-on-one guidance from industry professionals and experienced practitioners",
        priority: "VERY_ESSENTIAL",
        category: "DESIRED_GAINS"
    },
    {
        title: "Mobile-optimized learning",
        description: "Seamless learning experience across all devices with offline capability",
        priority: "FAIRLY_ESSENTIAL",
        category: "EXPECTED_GAINS"
    }
];

const painRelieversPool = [
    {
        title: "Micro-learning modules",
        description: "Break down complex topics into 5-10 minute digestible lessons that fit busy schedules",
        priority: "VERY_ESSENTIAL",
        category: "PAIN_KILLER"
    },
    {
        title: "Affordable subscription model",
        description: "Access to premium content at a fraction of traditional education costs",
        priority: "VERY_ESSENTIAL",
        category: "PAIN_KILLER"
    },
    {
        title: "AI-powered learning assistant",
        description: "Personalized guidance and recommendations to eliminate choice paralysis",
        priority: "FAIRLY_ESSENTIAL",
        category: "VITAMIN"
    },
    {
        title: "Curated content library",
        description: "Expert-selected, up-to-date materials that eliminate information overload",
        priority: "VERY_ESSENTIAL",
        category: "PAIN_KILLER"
    },
    {
        title: "Real-world case studies",
        description: "Practical examples and scenarios from actual industry situations",
        priority: "VERY_ESSENTIAL",
        category: "PAIN_KILLER"
    },
    {
        title: "Peer learning groups",
        description: "Small cohorts for collaborative learning and mutual accountability",
        priority: "FAIRLY_ESSENTIAL",
        category: "VITAMIN"
    },
    {
        title: "Regular content updates",
        description: "Continuously refreshed materials reflecting latest industry trends and practices",
        priority: "VERY_ESSENTIAL",
        category: "PAIN_KILLER"
    },
    {
        title: "Gamified progress system",
        description: "Achievement badges, streaks, and challenges to maintain motivation and engagement",
        priority: "FAIRLY_ESSENTIAL",
        category: "VITAMIN"
    }
];

const productsServicesPool = [
    {
        name: "Interactive Video Courses",
        description: "Engaging video content with quizzes, exercises, and downloadable resources",
        type: "DIGITAL",
        category: "Core Learning"
    },
    {
        name: "Live Workshop Sessions",
        description: "Real-time interactive sessions with industry experts and Q&A opportunities",
        type: "SERVICE",
        category: "Live Learning"
    },
    {
        name: "Project-Based Learning Tracks",
        description: "Structured learning paths culminating in portfolio-worthy projects",
        type: "DIGITAL",
        category: "Practical Application"
    },
    {
        name: "Mentorship Matching Service",
        description: "AI-powered matching with experienced professionals for personalized guidance",
        type: "SERVICE",
        category: "Support"
    },
    {
        name: "Mobile Learning App",
        description: "Native mobile application with offline content and progress synchronization",
        type: "DIGITAL",
        category: "Platform"
    },
    {
        name: "Career Coaching Sessions",
        description: "One-on-one coaching for career planning, resume review, and interview preparation",
        type: "SERVICE",
        category: "Career Support"
    },
    {
        name: "Industry Certification Programs",
        description: "Comprehensive certification tracks aligned with industry standards",
        type: "DIGITAL",
        category: "Credentials"
    },
    {
        name: "Community Learning Platform",
        description: "Social learning environment with forums, study groups, and peer collaboration tools",
        type: "DIGITAL",
        category: "Community"
    }
];

function getRandomItems<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
}

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function generateValuePropositions(personas: any[], batchSize: number = 1000) {
    console.log(`🎯 Generating value propositions for ${personas.length} personas in batches of ${batchSize}...`);

    const batches = Math.ceil(personas.length / batchSize);
    let totalGenerated = 0;

    const allValuePropositions = Array.from({ length: batches }, (_, batchIndex) => {
        const startIndex = batchIndex * batchSize;
        const endIndex = Math.min(startIndex + batchSize, personas.length);
        const currentBatchPersonas = personas.slice(startIndex, endIndex);

        const batch = currentBatchPersonas.map((persona, index) => {
            const offering = getRandomItem(valuePropositionOfferings);
            const description = getRandomItem(valuePropositionDescriptions);

            const vpStatements = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
                offering: getRandomItem(valuePropositionOfferings),
                description: getRandomItem(valuePropositionDescriptions)
            }));

            const customerJobs = getRandomItems(customerJobsPool, 2, 5).map((job, order) => ({
                ...job,
                order
            }));

            const customerPains = getRandomItems(customerPainsPool, 2, 4).map((pain, order) => ({
                ...pain,
                order
            }));

            const gainCreators = getRandomItems(gainCreatorsPool, 2, 5).map((gain, order) => ({
                ...gain,
                order
            }));

            const painRelievers = getRandomItems(painRelieversPool, 2, 4).map((reliever, order) => ({
                ...reliever,
                order
            }));

            const productsServices = getRandomItems(productsServicesPool, 1, 3).map((product, order) => ({
                ...product,
                features: null,
                order
            }));

            return {
                segmentId: persona.segmentId,
                personaId: persona.id,
                tags: JSON.stringify([persona.segment.name, "Learning", "Development"]),
                valuePropositionStatements: vpStatements,
                customerJobs,
                customerPains,
                gainCreators,
                painRelievers,
                productsServices
            };
        });

        totalGenerated += batch.length;
        console.log(`✅ Generated batch ${batchIndex + 1}/${batches} (${totalGenerated}/${personas.length} value propositions)`);

        return batch;
    }).flat();

    console.log(`🎉 Generated ${allValuePropositions.length} value propositions successfully!`);
    return allValuePropositions;
}

export async function seedValuePropositions() {
    try {
        console.log('🌱 Starting to seed value propositions...');

        console.log('👥 Fetching personas...');
        const personas = await prisma.persona.findMany({
            include: {
                segment: true
            }
        });

        if (personas.length === 0) {
            throw new Error('No personas found. Please run the customer segments seed first.');
        }

        console.log(`📊 Found ${personas.length} personas to create value propositions for`);

        console.log('💡 Generating value propositions...');
        const valuePropositions = generateValuePropositions(personas);

        console.log('💾 Creating value propositions with Bluebird concurrency control...');
        const concurrency = 5;
        let completed = 0;

        await Bluebird.map(valuePropositions, async (vpData: any) => {
            const {
                valuePropositionStatements,
                customerJobs,
                customerPains,
                gainCreators,
                painRelievers,
                productsServices,
                ...vpCore
            } = vpData;

            const createdVP = await prisma.valueProposition.create({
                data: {
                    ...vpCore,
                    customerJobs: JSON.stringify(customerJobs),
                    customerPains: JSON.stringify(customerPains),
                    gainCreators: JSON.stringify(gainCreators),
                    painRelievers: JSON.stringify(painRelievers),
                    productsServices: JSON.stringify(productsServices)
                }
            });

            if (valuePropositionStatements && valuePropositionStatements.length > 0) {
                await prisma.valuePropositionStatement.createMany({
                    data: valuePropositionStatements.map((stmt: any) => ({
                        ...stmt,
                        valuePropositionId: createdVP.id
                    }))
                });
            }

            completed++;

            if (completed % 100 === 0) {
                console.log(`✅ Created ${completed}/${valuePropositions.length} value propositions`);
            }

            return createdVP;
        }, { concurrency });

        console.log(`✅ All ${completed} value propositions created successfully!`);

        console.log('🎉 Value proposition seeding completed successfully!');

        const vpCount = await prisma.valueProposition.count();
        const statementsCount = await prisma.valuePropositionStatement.count();

        console.log(`📈 Summary:`);
        console.log(`   • ${vpCount} value propositions created`);
        console.log(`   • ${statementsCount} value proposition statements`);
        console.log(`   • Canvas components stored as JSON strings`);

    } catch (error) {
        console.error('❌ Error seeding value propositions:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}