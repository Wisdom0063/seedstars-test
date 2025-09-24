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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;
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
        valuePropositionStatements: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    const parsedResult = result.map(vp => ({
      ...vp,
      tags: vp.tags ? JSON.parse(vp.tags) : [],
      customerJobs: (vp as any).customerJobs ? JSON.parse((vp as any).customerJobs) : [],
      customerPains: (vp as any).customerPains ? JSON.parse((vp as any).customerPains) : [],
      gainCreators: (vp as any).gainCreators ? JSON.parse((vp as any).gainCreators) : [],
      painRelievers: (vp as any).painRelievers ? JSON.parse((vp as any).painRelievers) : [],
      productsServices: (vp as any).productsServices ? JSON.parse((vp as any).productsServices) : [],
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      data: {
        data: parsedResult,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage,
          count: parsedResult.length
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
