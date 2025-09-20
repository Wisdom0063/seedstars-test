import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/personas - Fetch all personas with their customer segments
export async function GET() {
  try {
    const personas = await prisma.persona.findMany({
      include: {
        segment: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Parse JSON fields for better frontend consumption
    const parsedPersonas = personas.map(persona => ({
      ...persona,
      painPoints: persona.painPoints ? JSON.parse(persona.painPoints) : [],
      purchasingBehavior: persona.purchasingBehavior ? JSON.parse(persona.purchasingBehavior) : {},
      channels: persona.channels ? JSON.parse(persona.channels) : []
    }));

    return NextResponse.json({
      success: true,
      data: parsedPersonas,
      count: parsedPersonas.length
    });
  } catch (error) {
    console.error('Error fetching personas:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch personas'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
