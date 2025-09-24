import { NextRequest, NextResponse } from 'next/server';
import type { UpdateValuePropositionRequest } from '@/lib/api/value-proposition';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{ id: string }>;
}



/**
 * Get a single value proposition by ID
 */
async function getById(id: string) {
  const valueProposition = await prisma.valueProposition.findUnique({
    where: { id },
    include: {
      segment: {
        select: { id: true, name: true }
      },
      persona: {
        select: { id: true, name: true }
      },
      valuePropositionStatements: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!valueProposition) return null;

  // Parse JSON fields
  return {
    ...valueProposition,
    tags: valueProposition.tags ? JSON.parse(valueProposition.tags) : [],
    customerJobs: (valueProposition as any).customerJobs ? JSON.parse((valueProposition as any).customerJobs) : [],
    customerPains: (valueProposition as any).customerPains ? JSON.parse((valueProposition as any).customerPains) : [],
    gainCreators: (valueProposition as any).gainCreators ? JSON.parse((valueProposition as any).gainCreators) : [],
    painRelievers: (valueProposition as any).painRelievers ? JSON.parse((valueProposition as any).painRelievers) : [],
    productsServices: (valueProposition as any).productsServices ? JSON.parse((valueProposition as any).productsServices) : [],
  };
}

/**
 * GET /api/value-propositions/[id]
 * Get a single value proposition by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Value proposition ID is required'
        },
        { status: 400 }
      );
    }

    const result = await getById(id);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Value proposition not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    const { id } = await params;
    console.error(`GET /api/value-propositions/${id} error:`, error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch value proposition'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/value-propositions/[id]
 * Update a value proposition - Complete replacement of all sections
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Value proposition ID is required'
        },
        { status: 400 }
      );
    }

    const data: UpdateValuePropositionRequest = await request.json();
    const existing = await prisma.valueProposition.findUnique({
      where: { id: data.id }
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Value proposition not found'
        },
        { status: 404 }
      );
    }

    // Update value proposition with JSON strings
    const updateData: any = {
      updatedAt: new Date()
    };

    if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
    if (data.customerJobs !== undefined) updateData.customerJobs = JSON.stringify(data.customerJobs);
    if (data.customerPains !== undefined) updateData.customerPains = JSON.stringify(data.customerPains);
    if (data.gainCreators !== undefined) updateData.gainCreators = JSON.stringify(data.gainCreators);
    if (data.painRelievers !== undefined) updateData.painRelievers = JSON.stringify(data.painRelievers);
    if (data.productsServices !== undefined) updateData.productsServices = JSON.stringify(data.productsServices);

    const valueProposition = await prisma.valueProposition.update({
      where: { id: data.id },
      data: updateData
    });

    if (data.valuePropositionStatements !== undefined) {
      await prisma.valuePropositionStatement.deleteMany({
        where: { valuePropositionId: data.id }
      });
      await prisma.valuePropositionStatement.createMany({
        data: data.valuePropositionStatements.map(statement => ({
          valuePropositionId: data.id,
          offering: statement.offering,
          description: statement.description
        }))
      });
    }

    // Fetch the complete updated value proposition
    const result = await getById(valueProposition.id);


    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.log(error)
    const { id } = await params;
    console.error(`PUT /api/value-propositions/${id} error:`, error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update value proposition'
      },
      { status: 500 }
    );
  }
}



