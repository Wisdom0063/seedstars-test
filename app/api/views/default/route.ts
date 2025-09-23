import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { DEFAULT_VIEWS } from '@/lib/api/views';

const prisma = new PrismaClient();

// GET /api/views/default - Get default view
export async function GET() {
  try {
    let defaultView = await prisma.view.findFirst({
      where: { isDefault: true },
    });

    // If no default view exists, create the first default view
    if (!defaultView) {
      const firstDefaultView = DEFAULT_VIEWS.find(view => view.isDefault);
      if (firstDefaultView) {
        defaultView = await prisma.view.create({
          data: {
            ...firstDefaultView,
            activeFilters: firstDefaultView.activeFilters ? JSON.stringify(firstDefaultView.activeFilters) : null,
            activeSorts: firstDefaultView.activeSorts ? JSON.stringify(firstDefaultView.activeSorts) : null,
            visibleFields: firstDefaultView.visibleFields ? JSON.stringify(firstDefaultView.visibleFields) : null,
          },
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'No default view found',
          },
          { status: 404 }
        );
      }
    }

    // Parse JSON fields
    const parsedView = {
      ...defaultView,
      filters: defaultView.filters ? JSON.parse(defaultView.filters) : null,
      visibleFields: defaultView.visibleFields ? JSON.parse(defaultView.visibleFields) : null,
    };

    return NextResponse.json({
      success: true,
      data: parsedView,
    });
  } catch (error) {
    console.error('Error fetching default view:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch default view',
      },
      { status: 500 }
    );
  }
}
