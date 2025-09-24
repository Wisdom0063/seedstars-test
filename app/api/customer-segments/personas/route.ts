import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

// PUT /api/personas - Update a persona
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Persona ID is required'
        },
        { status: 400 }
      );
    }

    const processedData: any = { ...updateData };
    if (updateData.painPoints && Array.isArray(updateData.painPoints)) {
      processedData.painPoints = JSON.stringify(updateData.painPoints);
    }
    if (updateData.purchasingBehavior && typeof updateData.purchasingBehavior === 'object') {
      processedData.purchasingBehavior = JSON.stringify(updateData.purchasingBehavior);
    }
    if (updateData.channels && Array.isArray(updateData.channels)) {
      processedData.channels = JSON.stringify(updateData.channels);
    }

    if (updateData.segment && typeof updateData.segment === 'object') {
      if (updateData.segment.id) {
        processedData.segmentId = updateData.segment.id;
      }
      delete processedData.segment;
    }
    delete processedData.id;
    delete processedData.createdAt;
    processedData.updatedAt = new Date();

    const updatedPersona = await prisma.persona.update({
      where: { id },
      data: processedData,
      include: {
        segment: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const parsedPersona = {
      ...updatedPersona,
      painPoints: updatedPersona.painPoints ? JSON.parse(updatedPersona.painPoints) : [],
      purchasingBehavior: updatedPersona.purchasingBehavior ? JSON.parse(updatedPersona.purchasingBehavior) : {},
      channels: updatedPersona.channels ? JSON.parse(updatedPersona.channels) : []
    };

    return NextResponse.json({
      success: true,
      data: parsedPersona,
      message: 'Persona updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating persona:', error);

    if (error?.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'Persona not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update persona'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
