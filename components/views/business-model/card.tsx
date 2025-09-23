'use client';

import React, { useState, forwardRef, useMemo, useCallback, useRef } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DraggableCard } from '@/components/ui/draggable-card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Target, Tag, Package, DollarSign, Lightbulb, Handshake } from 'lucide-react';
import { BusinessModelWithRelations } from '@/lib/api/business-model';
import { VirtualGridDnd, useContainerWidth } from '@/components/ui/virtual-grid-dnd';

interface BusinessModelCardProps {
    businessModel: BusinessModelWithRelations;
    onClick?: (businessModel: BusinessModelWithRelations) => void;
    className?: string;
    visibleFields?: string[];
}

export function BusinessModelCard({
    businessModel,
    onClick,
    className = "",
    visibleFields = []
}: BusinessModelCardProps) {
    // Helper function to check if a field should be visible
    const isFieldVisible = (fieldName: string) => {
        return visibleFields.length === 0 || visibleFields.includes(fieldName);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'border-l-green-500 bg-green-50';
            case 'draft':
                return 'border-l-yellow-500 bg-yellow-50';
            case 'archived':
                return 'border-l-gray-500 bg-gray-50';
            default:
                return 'border-l-blue-500 bg-blue-50';
        }
    };

    return (
        <DraggableCard
            id={businessModel.id}
            className={`
                cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] 
                border-l-4 ${getStatusColor(businessModel.status)} h-full
                ${className}
            `}
            onClick={() => onClick?.(businessModel)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            {isFieldVisible('name') && (
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    {businessModel.name}
                                </CardTitle>
                            )}
                            {isFieldVisible('status') && (
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                        variant={businessModel.status === 'active' ? 'default' : 'secondary'}
                                        className="text-xs"
                                    >
                                        {businessModel.status}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                    {isFieldVisible('segment') && businessModel.valuePropositionStatement?.valueProposition?.segment && (
                        <Badge variant="outline" className="shrink-0">
                            {businessModel.valuePropositionStatement.valueProposition.segment.name}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
                {/* Description */}
                {isFieldVisible('description') && businessModel.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {businessModel.description}
                    </p>
                )}

                {/* Persona */}
                {isFieldVisible('persona') && businessModel.valuePropositionStatement?.valueProposition?.persona && (
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate">
                            {businessModel.valuePropositionStatement.valueProposition.persona.name}
                        </span>
                    </div>
                )}

                {/* Value Proposition Statement */}
                {isFieldVisible('valuePropositionStatement') && businessModel.valuePropositionStatement && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium text-gray-700">Value Proposition</span>
                        </div>
                        <Badge
                            variant="outline"
                            className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                            title={businessModel.valuePropositionStatement.offering}
                        >
                            {businessModel.valuePropositionStatement.offering.length > 40
                                ? `${businessModel.valuePropositionStatement.offering.substring(0, 40)}...`
                                : businessModel.valuePropositionStatement.offering}
                        </Badge>
                    </div>
                )}

                {/* Key Partners Preview */}
                {isFieldVisible('keyPartners') && businessModel.keyPartners && businessModel.keyPartners.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Handshake className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">Key Partners</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {businessModel.keyPartners.slice(0, 3).map((partner, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    title={partner}
                                >
                                    {partner.length > 20 ? `${partner.substring(0, 20)}...` : partner}
                                </Badge>
                            ))}
                            {businessModel.keyPartners.length > 3 && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                    +{businessModel.keyPartners.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Key Activities Preview */}
                {isFieldVisible('keyActivities') && businessModel.keyActivities && businessModel.keyActivities.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium text-gray-700">Key Activities</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {businessModel.keyActivities.slice(0, 2).map((activity, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                                    title={activity}
                                >
                                    {activity.length > 25 ? `${activity.substring(0, 25)}...` : activity}
                                </Badge>
                            ))}
                            {businessModel.keyActivities.length > 2 && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                    +{businessModel.keyActivities.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Customer Segments Preview */}
                {isFieldVisible('customerSegments') && businessModel.customerSegments && businessModel.customerSegments.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">Customer Segments</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {businessModel.customerSegments.slice(0, 2).map((segment, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-green-50 text-green-700 border-green-200"
                                    title={segment}
                                >
                                    {segment.length > 20 ? `${segment.substring(0, 20)}...` : segment}
                                </Badge>
                            ))}
                            {businessModel.customerSegments.length > 2 && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                    +{businessModel.customerSegments.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Revenue Streams Preview */}
                {isFieldVisible('revenueStreams') && businessModel.revenueStreams && businessModel.revenueStreams.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-medium text-gray-700">Revenue Streams</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {businessModel.revenueStreams.slice(0, 2).map((stream, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                                    title={stream}
                                >
                                    {stream.length > 25 ? `${stream.substring(0, 25)}...` : stream}
                                </Badge>
                            ))}
                            {businessModel.revenueStreams.length > 2 && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                    +{businessModel.revenueStreams.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {isFieldVisible('tags') && businessModel.tags && businessModel.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {businessModel.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {businessModel.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs text-gray-500">
                                +{businessModel.tags.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </DraggableCard>
    );
}

interface BusinessModelCardsProps {
    businessModels: BusinessModelWithRelations[];
    onBusinessModelClick?: (businessModel: BusinessModelWithRelations) => void;
    onBusinessModelReorder?: (reorderedBusinessModels: BusinessModelWithRelations[]) => void;
    visibleFields?: string[];
}

export default function BusinessModelCards({
    businessModels,
    onBusinessModelClick,
    onBusinessModelReorder,
    visibleFields = []
}: BusinessModelCardsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const containerWidth = useContainerWidth(containerRef);

    // Calculate responsive columns and item width
    const columns = useMemo(() => {
        if (containerWidth <= 0) return 1;
        if (containerWidth < 640) return 1;      // Mobile: 1 column
        if (containerWidth < 1024) return 2;     // Tablet: 2 columns
        return 3;                                // Large desktop: 3 columns
    }, [containerWidth]);

    const itemWidth = useMemo(() => {
        if (containerWidth <= 0) return 350;
        const gap = 32;
        const totalGaps = (columns - 1) * gap;
        const availableWidth = containerWidth - totalGaps;
        return Math.floor(availableWidth / columns);
    }, [containerWidth, columns]);

    const renderItem = useCallback((businessModel: BusinessModelWithRelations) => (
        <BusinessModelCard
            key={businessModel.id}
            businessModel={businessModel}
            onClick={onBusinessModelClick}
            visibleFields={visibleFields}
        />
    ), [onBusinessModelClick, visibleFields]);

    const getItemKey = useCallback((businessModel: BusinessModelWithRelations) => businessModel.id, []);

    const handleReorder = useCallback((reorderedItems: BusinessModelWithRelations[]) => {
        onBusinessModelReorder?.(reorderedItems);
    }, [onBusinessModelReorder]);

    if (businessModels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Building2 className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No business models found</p>
                <p className="text-sm">Create your first business model to get started</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full h-full">
            <VirtualGridDnd
                data={businessModels}
                itemHeight="auto"
                itemWidth={itemWidth}
                columns={columns}
                gap={32}
                height={700}
                width="100%"
                overscan={3}
                renderItem={renderItem}
                getItemKey={getItemKey}
                onItemClick={onBusinessModelClick}
                onReorder={handleReorder}
                enableDragAndDrop={!!onBusinessModelReorder}
                className="w-full"
            />
        </div>
    );
}
