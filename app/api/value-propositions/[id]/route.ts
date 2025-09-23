import { NextRequest, NextResponse } from 'next/server';
import type { UpdateValuePropositionRequest } from '@/lib/api/value-proposition';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
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
      customerJobs: {
        orderBy: { createdAt: 'asc' }
      },
      customerPains: {
        orderBy: { createdAt: 'asc' }
      },
      gainCreators: {
        orderBy: { createdAt: 'asc' }
      },
      painRelievers: {
        orderBy: { createdAt: 'asc' }
      },
      productsServices: {
        orderBy: { createdAt: 'asc' }
      },
      valuePropositionStatements: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  return valueProposition;



}



/**
 * PUT /api/value-propositions/[id]
 * Update a value proposition - Complete replacement of all sections
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

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

    // Verify value proposition exists
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

    // Update value proposition with all components in a transaction
    const valueProposition = await prisma.$transaction(async (tx) => {
      // Update main value proposition
      const updateData: any = {
        updatedAt: new Date()
      };

      if (data.tags !== undefined) updateData.tags = data.tags ? JSON.stringify(data.tags) : null;

      const vp = await tx.valueProposition.update({
        where: { id: data.id },
        data: updateData
      });

      // Replace customer jobs
      if (data.customerJobs !== undefined) {
        await tx.customerJob.deleteMany({
          where: { valuePropositionId: data.id }
        });

        if (data.customerJobs.length > 0) {
          await tx.customerJob.createMany({
            data: data.customerJobs.map((job, index) => ({
              ...job,
              valuePropositionId: data.id,
              order: index
            }))
          });
        }
      }

      // Replace customer pains
      if (data.customerPains !== undefined) {
        await tx.customerPain.deleteMany({
          where: { valuePropositionId: data.id }
        });

        if (data.customerPains.length > 0) {
          await tx.customerPain.createMany({
            data: data.customerPains.map((pain, index) => ({
              ...pain,
              valuePropositionId: data.id,
              order: index
            }))
          });
        }
      }

      // Replace gain creators
      if (data.gainCreators !== undefined) {
        await tx.gainCreator.deleteMany({
          where: { valuePropositionId: data.id }
        });

        if (data.gainCreators.length > 0) {
          await tx.gainCreator.createMany({
            data: data.gainCreators.map((gain, index) => ({
              ...gain,
              valuePropositionId: data.id,
              order: index
            }))
          });
        }
      }

      // Replace pain relievers
      if (data.painRelievers !== undefined) {
        await tx.painReliever.deleteMany({
          where: { valuePropositionId: data.id }
        });

        if (data.painRelievers.length > 0) {
          await tx.painReliever.createMany({
            data: data.painRelievers.map((reliever, index) => ({
              ...reliever,
              valuePropositionId: data.id,
              order: index
            }))
          });
        }
      }

      // Replace products/services
      if (data.productsServices !== undefined) {
        await tx.productService.deleteMany({
          where: { valuePropositionId: data.id }
        });

        if (data.productsServices.length > 0) {
          await tx.productService.createMany({
            data: data.productsServices.map((product, index) => ({
              ...product,
              valuePropositionId: data.id,
              order: index
            }))
          });
        }
      }

      // Replace value proposition statements
      if (data.valuePropositionStatements !== undefined) {
        await tx.valuePropositionStatement.deleteMany({
          where: { valuePropositionId: data.id }
        });

        if (data.valuePropositionStatements.length > 0) {
          await tx.valuePropositionStatement.createMany({
            data: data.valuePropositionStatements.map((statement) => ({
              ...statement,
              valuePropositionId: data.id
            }))
          });
        }
      }

      return vp;
    });

    // Fetch the complete updated value proposition
    const result = await getById(valueProposition.id);


    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error(`PUT /api/value-propositions/${params.id} error:`, error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update value proposition'
      },
      { status: 500 }
    );
  }
}



