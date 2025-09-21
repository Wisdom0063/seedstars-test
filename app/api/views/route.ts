import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CreateViewRequest, DEFAULT_VIEWS } from '@/lib/api/views';

const prisma = new PrismaClient();

// GET /api/views - Get all views or filter by source
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    const whereClause = source ? { source: source as any } : {};

    const views = await prisma.view.findMany({
      where: whereClause,
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    // If no views exist, create default views
    // if (views.length === 0) {
    //   const defaultViews = await Promise.all(
    //     DEFAULT_VIEWS.map(view =>
    //       prisma.view.create({
    //         data: {
    //           ...view,
    //         }
    //       })
    //     )
    //   );

    //   return NextResponse.json({
    //     success: true,
    //     data: defaultViews.map(view => ({
    //       ...view,
    //       filters: view.filters ? JSON.parse(view.filters) : null,
    //       visibleFields: view.visibleFields ? JSON.parse(view.visibleFields) : null,
    //     })),
    //     count: defaultViews.length,
    //   });
    // }

    // Parse JSON fields
    const parsedViews = views.map(view => ({
      ...view,
      filters: view.filters ? JSON.parse(view.filters) : null,
      activeFilters: view.activeFilters ? JSON.parse(view.activeFilters) : null,
      activeSorts: view.activeSorts ? JSON.parse(view.activeSorts) : null,
      visibleFields: view.visibleFields ? JSON.parse(view.visibleFields) : null,
    }));

    return NextResponse.json({
      success: true,
      data: parsedViews,
      count: views.length,
    });
  } catch (error) {
    console.error('Error fetching views:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch views',
      },
      { status: 500 }
    );
  }
}

// POST /api/views - Create new view
export async function POST(request: NextRequest) {
  try {
    const body: CreateViewRequest = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: 'View name is required',
        },
        { status: 400 }
      );
    }

    const view = await prisma.view.create({
      data: {
        name: body.name,
        description: body.description,
        source: body.source || 'PERSONAS',
        layout: body.layout || 'CARD',
        filters: body.filters ? JSON.stringify(body.filters) : null,
        sortBy: body.sortBy,
        sortOrder: body.sortOrder || 'ASC',
        groupBy: body.groupBy,
        visibleFields: body.visibleFields ? JSON.stringify(body.visibleFields) : null,
        activeFilters: body.activeFilters ? JSON.stringify(body.activeFilters) : null,
        activeSorts: body.activeSorts ? JSON.stringify(body.activeSorts) : null,
      },
    });

    // Parse JSON fields for response
    const parsedView = {
      ...view,
      filters: view.filters ? JSON.parse(view.filters) : null,
      activeFilters: view.activeFilters ? JSON.parse(view.activeFilters) : null,
      activeSorts: view.activeSorts ? JSON.parse(view.activeSorts) : null,
      visibleFields: view.visibleFields ? JSON.parse(view.visibleFields) : null,
    };

    return NextResponse.json({
      success: true,
      data: parsedView,
    });
  } catch (error) {
    console.error('Error creating view:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create view',
      },
      { status: 500 }
    );
  }
}
