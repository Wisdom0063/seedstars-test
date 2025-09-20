import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/views/[id]/default - Set view as default
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if view exists
    const view = await prisma.view.findUnique({
      where: { id: params.id },
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

    // Use transaction to ensure only one default view
    await prisma.$transaction([
      // Remove default from all views
      prisma.view.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      }),
      // Set the specified view as default
      prisma.view.update({
        where: { id: params.id },
        data: { isDefault: true },
      }),
    ]);

    // Fetch the updated view
    const updatedView = await prisma.view.findUnique({
      where: { id: params.id },
    });

    if (!updatedView) {
      throw new Error('Failed to fetch updated view');
    }

    // Parse JSON fields
    const parsedView = {
      ...updatedView,
      filters: updatedView.filters ? JSON.parse(updatedView.filters) : null,
      visibleFields: updatedView.visibleFields ? JSON.parse(updatedView.visibleFields) : null,
    };

    return NextResponse.json({
      success: true,
      data: parsedView,
      message: 'Default view updated successfully',
    });
  } catch (error) {
    console.error('Error setting default view:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to set default view',
      },
      { status: 500 }
    );
  }
}
