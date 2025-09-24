import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * GET /api/value-propositions
 * Get all value propositions with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await prisma.valueProposition.count();

    const result = await prisma.valueProposition.findMany({
      skip,
      take: limit,
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

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      data: {
        data: result,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage,
          count: result.length
        }
      },
      success: true,
    });

  } catch (error) {
    console.error('GET /api/value-propositions error:', error);
    return NextResponse.json(
      {
        data: {
          success: false,
          error: 'Failed to fetch personas'
        }
      },
      { status: 500 }
    );
  }
}
