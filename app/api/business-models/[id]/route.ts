import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * Helper function to get a business model by ID with all relations
 */
async function getById(id: string) {
    const businessModel = await prisma.businessModel.findUnique({
        where: { id },
        include: {
            valuePropositionStatement: {
                include: {
                    valueProposition: {
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
                            }
                        }
                    }
                }
            }
        }
    });

    if (!businessModel) {
        return null;
    }

    return {
        ...businessModel,
        keyPartners: businessModel.keyPartners ? JSON.parse(businessModel.keyPartners) : [],
        keyActivities: businessModel.keyActivities ? JSON.parse(businessModel.keyActivities) : [],
        keyResources: businessModel.keyResources ? JSON.parse(businessModel.keyResources) : [],
        customerRelationships: businessModel.customerRelationships ? JSON.parse(businessModel.customerRelationships) : [],
        channels: businessModel.channels ? JSON.parse(businessModel.channels) : [],
        customerSegments: businessModel.customerSegments ? JSON.parse(businessModel.customerSegments) : [],
        costStructure: businessModel.costStructure ? JSON.parse(businessModel.costStructure) : [],
        revenueStreams: businessModel.revenueStreams ? JSON.parse(businessModel.revenueStreams) : [],
        tags: businessModel.tags ? JSON.parse(businessModel.tags) : []
    };
}

/**
 * GET /api/business-models/[id]
 * Get a single business model by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Business model ID is required'
                },
                { status: 400 }
            );
        }

        const businessModel = await getById(id);

        if (!businessModel) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Business model not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: businessModel
        });

    } catch (error) {
        const { id } = await params;
        console.error(`GET /api/business-models/${id} error:`, error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch business model'
            },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/business-models/[id]
 * Update a business model - Complete replacement of all sections
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Business model ID is required'
                },
                { status: 400 }
            );
        }

        const data = await request.json();

        const existing = await prisma.businessModel.findUnique({
            where: { id }
        });

        if (!existing) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Business model not found'
                },
                { status: 404 }
            );
        }

        const businessModel = await prisma.businessModel.update({
            where: { id },
            data: {
                keyPartners: data.keyPartners !== undefined ?
                    (data.keyPartners ? JSON.stringify(data.keyPartners) : null) : existing.keyPartners,
                keyActivities: data.keyActivities !== undefined ?
                    (data.keyActivities ? JSON.stringify(data.keyActivities) : null) : existing.keyActivities,
                keyResources: data.keyResources !== undefined ?
                    (data.keyResources ? JSON.stringify(data.keyResources) : null) : existing.keyResources,
                customerRelationships: data.customerRelationships !== undefined ?
                    (data.customerRelationships ? JSON.stringify(data.customerRelationships) : null) : existing.customerRelationships,
                channels: data.channels !== undefined ?
                    (data.channels ? JSON.stringify(data.channels) : null) : existing.channels,
                customerSegments: data.customerSegments !== undefined ?
                    (data.customerSegments ? JSON.stringify(data.customerSegments) : null) : existing.customerSegments,
                costStructure: data.costStructure !== undefined ?
                    (data.costStructure ? JSON.stringify(data.costStructure) : null) : existing.costStructure,
                revenueStreams: data.revenueStreams !== undefined ?
                    (data.revenueStreams ? JSON.stringify(data.revenueStreams) : null) : existing.revenueStreams,
                tags: data.tags !== undefined ?
                    (data.tags ? JSON.stringify(data.tags) : null) : existing.tags,
                notes: data.notes !== undefined ? data.notes : existing.notes,
                updatedBy: data.updatedBy,
                updatedAt: new Date()
            }
        });

        const result = await getById(businessModel.id);

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        const { id } = await params;
        console.error(`PUT /api/business-models/${id} error:`, error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update business model'
            },
            { status: 500 }
        );
    }
}


