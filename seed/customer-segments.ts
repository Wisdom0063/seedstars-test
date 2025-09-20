import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock data for customer segments
const customerSegments = [
    {
        name: "Early Career Professionals",
    },
    {
        name: "Working Parents",
    },
    {
        name: "Career Changers",
    },
    {
        name: "Students & Recent Graduates",
    },
    {
        name: "Lifelong Learners",
    }
];

// Mock data for personas
const personas = [
    {
        name: "Mary Learning",
        age: 28,
        gender: "Female",
        location: "Accra",
        education: "Nursery",
        incomePerMonth: "GHS 500-1000",
        painPoints: JSON.stringify([
            "Mary's teaching, 3 kids, 5 year-old girl from Accra, is just beginning her educational journey in nursery school.",
            "Limited access to engaging educational content that captures her interest and supports her learning.",
            "Her parents struggle to find reliable and age-appropriate resources that are both educational and entertaining."
        ]),
        purchasingBehavior: JSON.stringify({
            description: "Mary's parents are the primary decision makers when it comes to purchasing educational products for her.",
            preferences: "They often rely on recommendations from other parents, online reviews, and educational experts to make informed decisions."
        }),
        channels: JSON.stringify([
            "Given their location in Accra, they prefer products that are easily accessible online or available in local stores."
        ]),
        quote: "I love learning new things, especially when it's fun and colorful!",
        description: "A curious 5-year-old beginning her educational journey with enthusiasm for interactive and engaging learning experiences.",
        segmentName: "Students & Recent Graduates"
    },
    {
        name: "Sarah Professional",
        age: 32,
        gender: "Female",
        location: "Lagos",
        education: "Bachelor's Degree",
        incomePerMonth: "NGN 200,000-400,000",
        painPoints: JSON.stringify([
            "Struggling to balance career advancement with personal development",
            "Limited time for traditional learning methods",
            "Difficulty finding relevant skills training for her industry"
        ]),
        purchasingBehavior: JSON.stringify({
            description: "Values efficiency and ROI in educational investments",
            preferences: "Prefers online courses, mobile learning, and certification programs that can boost career prospects"
        }),
        channels: JSON.stringify([
            "LinkedIn Learning",
            "Professional networks",
            "Industry conferences",
            "Mobile apps"
        ]),
        quote: "I need learning solutions that fit into my busy schedule and directly impact my career growth.",
        description: "An ambitious professional seeking flexible learning opportunities to advance her career while managing work-life balance.",
        segmentName: "Early Career Professionals"
    },
    {
        name: "David Parent",
        age: 38,
        gender: "Male",
        location: "Nairobi",
        education: "Master's Degree",
        incomePerMonth: "KES 80,000-120,000",
        painPoints: JSON.stringify([
            "Juggling work responsibilities with family time",
            "Wants to upskill but has limited evening/weekend availability",
            "Concerned about staying relevant in rapidly changing job market"
        ]),
        purchasingBehavior: JSON.stringify({
            description: "Careful spender who researches thoroughly before purchasing",
            preferences: "Values family-friendly learning options and flexible payment plans"
        }),
        channels: JSON.stringify([
            "Family-oriented platforms",
            "Weekend workshops",
            "Online communities for parents",
            "Employer-sponsored programs"
        ]),
        quote: "I want to grow professionally without sacrificing time with my family.",
        description: "A dedicated father and professional seeking learning opportunities that accommodate his family commitments.",
        segmentName: "Working Parents"
    },
    {
        name: "Jennifer Transition",
        age: 45,
        gender: "Female",
        location: "Cape Town",
        education: "Bachelor's Degree",
        incomePerMonth: "ZAR 25,000-35,000",
        painPoints: JSON.stringify([
            "Feeling overwhelmed by the prospect of changing careers mid-life",
            "Lack of confidence in learning new technologies",
            "Financial constraints while transitioning careers"
        ]),
        purchasingBehavior: JSON.stringify({
            description: "Cautious buyer who needs strong support and guarantees",
            preferences: "Prefers structured programs with mentorship and community support"
        }),
        channels: JSON.stringify([
            "Career counseling services",
            "Adult education centers",
            "Professional coaching platforms",
            "Support groups and forums"
        ]),
        quote: "I'm ready for a change, but I need guidance and support to make it happen successfully.",
        description: "A mid-career professional seeking to transition to a new field with comprehensive support and structured learning.",
        segmentName: "Career Changers"
    },
    {
        name: "Robert Curious",
        age: 62,
        gender: "Male",
        location: "Johannesburg",
        education: "High School",
        incomePerMonth: "ZAR 15,000-25,000",
        painPoints: JSON.stringify([
            "Wants to stay mentally active and engaged in retirement",
            "Technology can be intimidating and overwhelming",
            "Limited budget for learning activities"
        ]),
        purchasingBehavior: JSON.stringify({
            description: "Price-sensitive but values quality and personal attention",
            preferences: "Prefers in-person or hybrid learning with strong customer support"
        }),
        channels: JSON.stringify([
            "Community centers",
            "Senior learning programs",
            "Local libraries",
            "Word-of-mouth recommendations"
        ]),
        quote: "Learning keeps me young at heart, and I love discovering new things every day.",
        description: "An enthusiastic lifelong learner who enjoys exploring new subjects and staying intellectually engaged.",
        segmentName: "Lifelong Learners"
    }
];

export async function seedCustomerSegments() {
    try {
        console.log('🌱 Starting to seed data...');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await prisma.persona.deleteMany();
        await prisma.customerSegment.deleteMany();

        // Create customer segments
        console.log('📊 Creating customer segments...');
        const createdSegments = [];
        for (const segment of customerSegments) {
            const createdSegment = await prisma.customerSegment.create({
                data: segment,
            });
            createdSegments.push(createdSegment);
            console.log(`✅ Created segment: ${createdSegment.name}`);
        }

        // Create personas
        console.log('👥 Creating personas...');
        for (const persona of personas) {
            // Find the segment ID by name
            const segment = createdSegments.find(s => s.name === persona.segmentName);
            if (!segment) {
                console.error(`❌ Could not find segment: ${persona.segmentName}`);
                continue;
            }

            const { segmentName, ...personaData } = persona;
            await prisma.persona.create({
                data: {
                    ...personaData,
                    segmentId: segment.id,
                },
            });
            console.log(`✅ Created persona: ${persona.name}`);
        }

        console.log('🎉 Data seeding completed successfully!');

        // Display summary
        const segmentCount = await prisma.customerSegment.count();
        const personaCount = await prisma.persona.count();
        console.log(`📈 Summary: ${segmentCount} segments, ${personaCount} personas created`);

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}


