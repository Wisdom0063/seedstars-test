import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { UpdateViewRequest } from '@/lib/api/views';

const prisma = new PrismaClient();

// GET /api/views/[id] - Get view by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const view = await prisma.view.findUnique({
      where: { id },
    });

    if (!view) {
      return NextResponse.json(
        {
          success: false,
          error: 'View not found',
        },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const parsedView = {
      ...view,
      filters: view.filters ? JSON.parse(view.filters) : null,
      visibleFields: view.visibleFields ? JSON.parse(view.visibleFields) : null,
      activeSorts: view.activeSorts ? JSON.parse(view.activeSorts) : null,
      activeFilters: view.activeFilters ? JSON.parse(view.activeFilters) : null,
    };

    return NextResponse.json({
      success: true,
      data: parsedView,
    });
  } catch (error) {
    console.error('Error fetching view:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch view',
      },
      { status: 500 }
    );
  }
}

// PUT /api/views/[id] - Update view
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Omit<UpdateViewRequest, 'id'> = await request.json();
    const existingView = await prisma.view.findUnique({
      where: { id },
    });

    if (!existingView) {
      return NextResponse.json(
        {
          success: false,
          error: 'View not found',
        },
        { status: 404 }
      );
    }

    console.log('Updating view:', {
      ...(body.name && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.source && { source: body.source }),
      ...(body.layout && { layout: body.layout }),
      ...(body.activeFilters !== undefined && {
        activeFilters: body.activeFilters ? JSON.stringify(body.activeFilters) : null
      }),
      ...(body.activeSorts !== undefined && {
        activeSorts: body.activeSorts ? JSON.stringify(body.activeSorts) : null
      }),
      ...(body.sortBy !== undefined && { sortBy: body.sortBy }),
      ...(body.sortOrder && { sortOrder: body.sortOrder }),
      ...(body.groupBy !== undefined && { groupBy: body.groupBy }),
      ...(body.visibleFields !== undefined && {
        visibleFields: body.visibleFields ? JSON.stringify(body.visibleFields) : null
      })
    });

    const view = await prisma.view.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.source && { source: body.source }),
        ...(body.layout && { layout: body.layout }),
        ...(body.activeFilters !== undefined && {
          activeFilters: body.activeFilters ? JSON.stringify(body.activeFilters) : null
        }),
        ...(body.activeSorts !== undefined && {
          activeSorts: body.activeSorts ? JSON.stringify(body.activeSorts) : null
        }),
        ...(body.sortBy !== undefined && { sortBy: body.sortBy }),
        ...(body.sortOrder && { sortOrder: body.sortOrder }),
        ...(body.groupBy !== undefined && { groupBy: body.groupBy }),
        ...(body.visibleFields !== undefined && {
          visibleFields: body.visibleFields ? JSON.stringify(body.visibleFields) : null
        }),
      },
    });

    // Parse JSON fields for response
    const parsedView = {
      ...view,
      activeFilters: view.activeFilters ? JSON.parse(view.activeFilters) : null,
      activeSorts: view.activeSorts ? JSON.parse(view.activeSorts) : null,
      visibleFields: view.visibleFields ? JSON.parse(view.visibleFields) : null,
    };

    return NextResponse.json({
      success: true,
      data: parsedView,
    });
  } catch (error) {
    console.error('Error updating view:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update view',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/views/[id] - Delete view
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if view exists
    const existingView = await prisma.view.findUnique({
      where: { id },
    });

    if (!existingView) {
      return NextResponse.json(
        {
          success: false,
          error: 'View not found',
        },
        { status: 404 }
      );
    }

    // Don't allow deleting the default view
    if (existingView.isDefault) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete the default view',
        },
        { status: 400 }
      );
    }

    await prisma.view.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'View deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting view:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete view',
      },
      { status: 500 }
    );
  }
}
