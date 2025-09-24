import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const customerSegments = await prisma.customerSegment.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: customerSegments,
      count: customerSegments.length
    });
  } catch (error) {
    console.error('Error fetching customer segments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch customer segments'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
