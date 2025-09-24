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

    // Prepare the update data - stringify JSON fields if they exist
    const processedData: any = { ...updateData };

    // Handle JSON fields that need to be stringified for database storage
    if (updateData.painPoints && Array.isArray(updateData.painPoints)) {
      processedData.painPoints = JSON.stringify(updateData.painPoints);
    }
    if (updateData.purchasingBehavior && typeof updateData.purchasingBehavior === 'object') {
      processedData.purchasingBehavior = JSON.stringify(updateData.purchasingBehavior);
    }
    if (updateData.channels && Array.isArray(updateData.channels)) {
      processedData.channels = JSON.stringify(updateData.channels);
    }

    // Handle segment update - if segment is provided as an object, extract the ID
    if (updateData.segment && typeof updateData.segment === 'object') {
      if (updateData.segment.id) {
        processedData.segmentId = updateData.segment.id;
      }
      // Remove the segment object from processed data as we use segmentId for the relation
      delete processedData.segment;
    }

    // Remove fields that shouldn't be updated
    delete processedData.id;
    delete processedData.createdAt;

    // Update the updatedAt timestamp
    processedData.updatedAt = new Date();

    // Update the persona in the database
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

    // Parse JSON fields for response
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

    // Handle specific Prisma errors
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
