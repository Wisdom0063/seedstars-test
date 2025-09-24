import { PrismaClient } from '@prisma/client';
import Bluebird from 'bluebird';

const prisma = new PrismaClient();

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

const firstNames = [
    "Mary", "Sarah", "David", "Jennifer", "Robert", "Lisa", "Michael", "Jessica", "James", "Ashley",
    "Christopher", "Amanda", "Daniel", "Melissa", "Matthew", "Deborah", "Anthony", "Dorothy", "Mark", "Lisa",
    "Donald", "Nancy", "Steven", "Karen", "Paul", "Betty", "Andrew", "Helen", "Joshua", "Sandra",
    "Kenneth", "Donna", "Kevin", "Carol", "Brian", "Ruth", "George", "Sharon", "Edward", "Michelle",
    "Ronald", "Laura", "Timothy", "Sarah", "Jason", "Kimberly", "Jeffrey", "Deborah", "Ryan", "Dorothy",
    "Jacob", "Lisa", "Gary", "Nancy", "Nicholas", "Karen", "Eric", "Betty", "Jonathan", "Helen",
    "Stephen", "Sandra", "Larry", "Donna", "Justin", "Carol", "Scott", "Ruth", "Brandon", "Sharon",
    "Benjamin", "Michelle", "Samuel", "Laura", "Gregory", "Sarah", "Alexander", "Kimberly", "Patrick", "Deborah",
    "Jack", "Dorothy", "Dennis", "Lisa", "Jerry", "Nancy", "Tyler", "Karen", "Aaron", "Betty",
    "Jose", "Helen", "Henry", "Sandra", "Adam", "Donna", "Douglas", "Carol", "Nathan", "Ruth",
    "Peter", "Sharon", "Zachary", "Michelle", "Kyle", "Laura", "Noah", "Sarah", "Alan", "Kimberly",
    "Ethan", "Deborah", "Jeremy", "Dorothy", "Lionel", "Lisa", "Mike", "Nancy", "Albert", "Karen",
    "Wayne", "Betty", "Mason", "Helen", "Roy", "Sandra", "Ralph", "Donna", "Eugene", "Carol",
    "Louis", "Ruth", "Philip", "Sharon", "Bobby", "Michelle", "Johnny", "Laura", "Mason", "Sarah"
];

const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
    "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
    "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
    "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
    "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez"
];

const locations = [
    "Accra", "Lagos", "Nairobi", "Cape Town", "Johannesburg", "Casablanca", "Cairo", "Tunis", "Algiers", "Khartoum",
    "Addis Ababa", "Dar es Salaam", "Kampala", "Kigali", "Lusaka", "Harare", "Gaborone", "Windhoek", "Maputo", "Antananarivo",
    "Port Louis", "Victoria", "Moroni", "Djibouti", "Asmara", "Mogadishu", "Juba", "Bangui", "N'Djamena", "Yaoundé",
    "Malabo", "Libreville", "Brazzaville", "Kinshasa", "Luanda", "São Tomé", "Praia", "Bissau", "Conakry", "Freetown",
    "Monrovia", "Yamoussoukro", "Ouagadougou", "Bamako", "Niamey", "Abuja", "Porto-Novo", "Lomé", "Accra", "Banjul"
];

const educationLevels = [
    "High School", "Some College", "Associate Degree", "Bachelor's Degree", "Master's Degree", "PhD", "Professional Degree",
    "Trade School", "Vocational Training", "Online Certification", "Bootcamp Graduate", "Self-taught"
];

const genders = ["Male", "Female"];

const incomeRanges = [
    "Under $20,000", "$20,000-$40,000", "$40,000-$60,000", "$60,000-$80,000", "$80,000-$100,000",
    "$100,000-$150,000", "$150,000-$200,000", "Over $200,000", "GHS 500-1000", "GHS 1000-2000",
    "NGN 50,000-100,000", "NGN 100,000-200,000", "NGN 200,000-400,000", "KES 30,000-60,000",
    "KES 60,000-120,000", "ZAR 15,000-25,000", "ZAR 25,000-35,000", "ZAR 35,000-50,000"
];

const painPointsPool = [
    "Limited time for learning due to work commitments",
    "Difficulty finding relevant and up-to-date content",
    "Financial constraints limiting access to quality education",
    "Technology barriers and digital literacy challenges",
    "Lack of personalized learning paths",
    "Balancing family responsibilities with personal development",
    "Staying motivated without structured accountability",
    "Finding credible and trustworthy learning sources",
    "Language barriers in accessing global content",
    "Lack of practical, hands-on learning opportunities",
    "Difficulty measuring progress and ROI on learning",
    "Information overload and choice paralysis",
    "Lack of networking and community support",
    "Outdated skills becoming irrelevant in job market",
    "Imposter syndrome and confidence issues",
    "Geographic limitations for in-person learning",
    "Lack of employer support for professional development",
    "Difficulty transitioning between different learning formats",
    "Time zone challenges for live online sessions",
    "Limited access to mentorship and guidance"
];

const channelsPool = [
    "LinkedIn Learning", "YouTube", "Coursera", "Udemy", "edX", "Khan Academy", "Skillshare", "MasterClass",
    "Professional networks", "Industry conferences", "Mobile apps", "Podcasts", "Online communities",
    "Social media groups", "Local libraries", "Community centers", "University extension programs",
    "Corporate training programs", "Mentorship platforms", "Peer learning groups", "Online forums",
    "Webinars", "Virtual workshops", "E-books", "Audio books", "Micro-learning platforms",
    "Certification programs", "Bootcamps", "Trade associations", "Professional coaching"
];

const quotesPool = [
    "Learning is a lifelong journey that never ends.",
    "I believe in continuous improvement and growth.",
    "Education is the key to unlocking my potential.",
    "I'm always looking for ways to stay ahead in my field.",
    "Knowledge is power, and I want to be empowered.",
    "I learn best when I can apply knowledge immediately.",
    "Flexibility in learning is crucial for my busy lifestyle.",
    "I value practical skills over theoretical knowledge.",
    "Community and collaboration enhance my learning experience.",
    "I need learning that fits into my schedule, not the other way around.",
    "Quality content is worth investing in.",
    "I prefer bite-sized learning that I can digest easily.",
    "Hands-on experience is more valuable than lectures.",
    "I want to learn from industry experts and practitioners.",
    "Networking is as important as the content itself.",
    "I need clear learning outcomes and measurable progress.",
    "Technology should enhance, not complicate, my learning.",
    "I learn better in interactive and engaging environments.",
    "Personalized learning paths work best for me.",
    "I value credentials and certifications for career advancement."
];

function getRandomUniqueItems<T>(pool: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, pool.length));
}

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function generatePersonas(count: number, batchSize: number = 1000) {
    console.log(`🎯 Generating ${count} personas in batches of ${batchSize}...`);

    const batches = Math.ceil(count / batchSize);
    let totalGenerated = 0;
    const segmentNames = customerSegments.map(s => s.name);

    const descriptions = {
        "Early Career Professionals": (age: number, location: string) =>
            `An ambitious ${age}-year-old professional from ${location} focused on career advancement and skill development.`,
        "Working Parents": (age: number, location: string) =>
            `A dedicated ${age}-year-old parent from ${location} balancing family responsibilities with professional growth.`,
        "Career Changers": (age: number, location: string) =>
            `A motivated ${age}-year-old from ${location} seeking to transition to a new career path with structured support.`,
        "Students & Recent Graduates": (age: number, location: string) =>
            `An enthusiastic ${age}-year-old from ${location} beginning their professional journey with a focus on practical skills.`,
        "Lifelong Learners": (age: number, location: string) =>
            `A curious ${age}-year-old from ${location} passionate about continuous learning and personal development.`
    };

    const purchasingBehaviors = {
        "Early Career Professionals": {
            description: "Values ROI and career impact in educational investments",
            preferences: "Prefers flexible, career-focused learning with industry recognition"
        },
        "Working Parents": {
            description: "Careful spender who needs family-friendly and time-efficient solutions",
            preferences: "Values flexible scheduling and family-oriented learning options"
        },
        "Career Changers": {
            description: "Cautious buyer seeking comprehensive support and proven results",
            preferences: "Prefers structured programs with mentorship and community support"
        },
        "Students & Recent Graduates": {
            description: "Budget-conscious but willing to invest in future career prospects",
            preferences: "Seeks affordable, practical learning with job market relevance"
        },
        "Lifelong Learners": {
            description: "Values quality content and personal enrichment over credentials",
            preferences: "Prefers diverse learning formats and community engagement"
        }
    };

    const allPersonas = Array.from({ length: batches }, (_, batchIndex) => {
        const startIndex = batchIndex * batchSize;
        const endIndex = Math.min(startIndex + batchSize, count);
        const currentBatchSize = endIndex - startIndex;

        const batch = Array.from({ length: currentBatchSize }, (_, index) => {
            const firstName = getRandomItem(firstNames);
            const lastName = getRandomItem(lastNames);
            const name = `${firstName} ${lastName}`;
            const age = Math.floor(Math.random() * 50) + 18; // 18-67 years old
            const gender = getRandomItem(genders);
            const location = getRandomItem(locations);
            const education = getRandomItem(educationLevels);
            const incomePerMonth = getRandomItem(incomeRanges);
            const segmentName = getRandomItem(segmentNames);
            const quote = getRandomItem(quotesPool);

            const painPoints = getRandomUniqueItems(painPointsPool, 2, 5);
            const channels = getRandomUniqueItems(channelsPool, 2, 6);

            return {
                name,
                age,
                gender,
                location,
                education,
                incomePerMonth,
                painPoints: JSON.stringify(painPoints),
                purchasingBehavior: JSON.stringify(purchasingBehaviors[segmentName as keyof typeof purchasingBehaviors]),
                channels: JSON.stringify(channels),
                quote,
                description: descriptions[segmentName as keyof typeof descriptions](age, location),
                segmentName
            };
        });

        totalGenerated += currentBatchSize;
        console.log(`✅ Generated batch ${batchIndex + 1}/${batches} (${totalGenerated}/${count} personas)`);

        return batch;
    }).flat();

    console.log(`🎉 Generated ${allPersonas.length} personas successfully!`);
    return allPersonas;
}

export async function seedCustomerSegments() {
    try {
        console.log('🌱 Starting to seed customer segments and personas...');

        console.log('📊 Creating customer segments...');
        const createdSegments: { id: string; name: string }[] = [];
        for (const segment of customerSegments) {
            const createdSegment = await prisma.customerSegment.create({
                data: segment,
            });
            createdSegments.push(createdSegment);
            console.log(`✅ Created segment: ${createdSegment.name}`);
        }

        console.log('👥 Generating 10,000 personas...');
        const personas = generatePersonas(10000);

        console.log('🔄 Preparing persona data...');
        const personasWithSegmentId = personas.map(persona => {
            const segment = createdSegments.find(s => s.name === persona.segmentName);
            if (!segment) {
                throw new Error(`Could not find segment: ${persona.segmentName}`);
            }

            const { segmentName, ...personaData } = persona;
            return {
                ...personaData,
                segmentId: segment.id,
            };
        });

        console.log('💾 Creating personas with Bluebird concurrency control...');
        const concurrency = 500; // Process 1000 personas concurrently
        let completed = 0;

        await Bluebird.map(personasWithSegmentId, async (personaData: any) => {
            const result = await prisma.persona.create({
                data: personaData,
            });
            completed++;

            if (completed % 500 === 0) {
                console.log(`✅ Created ${completed}/${personasWithSegmentId.length} personas`);
            }

            return result;
        }, { concurrency });

        console.log(`✅ All ${completed} personas created successfully!`);

        console.log('🎉 Data seeding completed successfully!');

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


