import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/business-models
 * Get all business models with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
    try {
        const result = await prisma.businessModel.findMany({
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const parsedResult = result.map(businessModel => ({
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
        }));

        return NextResponse.json({
            success: true,
            data: parsedResult,
            count: parsedResult.length
        });

    } catch (error) {
        console.error('GET /api/business-models error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch business models'
            },
            { status: 500 }
        );
    }
}

