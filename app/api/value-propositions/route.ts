import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * GET /api/value-propositions
 * Get all value propositions with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {

    const result = await prisma.valueProposition.findMany({
      include: {
        segment: {
          select: {
            id: true,
            name: true
          }
        },
        persona: {
          select: {
            id: true,
            name: true
          }
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
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('GET /api/value-propositions error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch personas'
      },
      { status: 500 }
    );
  }
}
