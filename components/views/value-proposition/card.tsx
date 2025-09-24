'use client';

import React, { useState, forwardRef, useMemo, useCallback, useRef } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DraggableCard } from '@/components/ui/draggable-card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Users, Target, Tag } from 'lucide-react';
import { ValuePropositionWithRelations } from '@/lib/api/value-proposition';
import { VirtualGridDnd, useContainerWidth } from '@/components/ui/virtual-grid-dnd';
import { useVirtualizedGridHeight } from '@/hooks/use-dynamic-height';
import { isFieldVisible } from '@/lib/utils';

interface ValuePropositionCardProps {
    valueProposition: ValuePropositionWithRelations;
    onClick?: (valueProposition: ValuePropositionWithRelations) => void;
    className?: string;
    visibleFields?: string[];
}

export function ValuePropositionCard({
    valueProposition,
    onClick,
    className = "",
    visibleFields = []
}: ValuePropositionCardProps) {
    return (
        <DraggableCard
            id={valueProposition.id}
            className={`
        cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] 
        border-l-4  h-full
        ${className}
      `}
            onClick={() => onClick?.(valueProposition)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                            <Lightbulb className="h-3 w-3" />
                        </div>
                        <div>
                            {isFieldVisible(visibleFields, 'name') && (
                                <CardTitle className="text-md font-semibold text-gray-900">
                                    {valueProposition.persona ? ` ${valueProposition.persona.name}` : ` ${valueProposition.segment.name}`}
                                </CardTitle>
                            )}

                        </div>
                    </div>
                    {isFieldVisible(visibleFields, 'segment') && (
                        <Badge variant="outline" className="shrink-0">
                            {valueProposition.segment.name}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">


                {/* Persona */}
                {isFieldVisible(visibleFields, 'persona') && valueProposition.persona && (
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate">{valueProposition.persona.name}</span>
                    </div>
                )}

                {isFieldVisible(visibleFields, 'valuePropositionStatements') && valueProposition.valuePropositionStatements && valueProposition.valuePropositionStatements.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium text-gray-700">Value Propositions</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {valueProposition.valuePropositionStatements.slice(0, 2).map((statement, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                                    title={statement.offering}
                                >
                                    {statement.offering.length > 30 ? `${statement.offering.substring(0, 30)}...` : statement.offering}
                                </Badge>
                            ))}
                            {valueProposition.valuePropositionStatements.length > 2 && (
                                <Badge
                                    variant="outline"
                                    className="text-xs"
                                    title={valueProposition.valuePropositionStatements.slice(2).map(s => s.offering).join(', ')}
                                >
                                    +{valueProposition.valuePropositionStatements.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {isFieldVisible(visibleFields, 'customerJobs') && valueProposition.customerJobs && valueProposition.customerJobs.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">Customer Jobs</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {valueProposition.customerJobs.slice(0, 2).map((job, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                    {job.title.length > 25 ? `${job.title.substring(0, 25)}...` : job.title}
                                </Badge>
                            ))}
                            {valueProposition.customerJobs.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{valueProposition.customerJobs.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {isFieldVisible(visibleFields, 'customerPains') && valueProposition.customerPains && valueProposition.customerPains.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-700">Customer Pains</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {valueProposition.customerPains.slice(0, 2).map((pain, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-red-50 text-red-700 border-red-200"
                                >
                                    {pain.title.length > 25 ? `${pain.title.substring(0, 25)}...` : pain.title}
                                </Badge>
                            ))}
                            {valueProposition.customerPains.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{valueProposition.customerPains.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {isFieldVisible(visibleFields, 'productsServices') && valueProposition.productsServices && valueProposition.productsServices.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">Products & Services</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {valueProposition.productsServices.slice(0, 2).map((product, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                    {product.name.length > 25 ? `${product.name.substring(0, 25)}...` : product.name}
                                </Badge>
                            ))}
                            {valueProposition.productsServices.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{valueProposition.productsServices.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </DraggableCard>
    );
}


interface ValuePropositionCardsProps {
    valuePropositions: ValuePropositionWithRelations[];
    onValuePropositionClick?: (valueProposition: ValuePropositionWithRelations) => void;
    visibleFields?: string[];
    onValuePropositionReorder?: (reorderedValuePropositions: ValuePropositionWithRelations[]) => void;
}

export default function ValuePropositionCards({
    valuePropositions,
    onValuePropositionClick,
    visibleFields,
    onValuePropositionReorder
}: ValuePropositionCardsProps) {
    const [items, setItems] = useState(valuePropositions);

    React.useEffect(() => {
        setItems(valuePropositions);
    }, [valuePropositions]);

    const containerRef = useRef<HTMLDivElement>(null);
    const containerWidth = useContainerWidth(containerRef);
    const { height: dynamicHeight, containerRef: heightRef } = useVirtualizedGridHeight();

    const columns = useMemo(() => {
        if (containerWidth <= 0) return 1;

        if (containerWidth < 640) return 1;
        if (containerWidth < 1024) return 2;
        return 3;
    }, [containerWidth]);

    const itemWidth = useMemo(() => {
        if (containerWidth <= 0) return 350;

        const gap = 32;
        const totalGaps = (columns - 1) * gap;
        const availableWidth = containerWidth - totalGaps;
        return Math.floor(availableWidth / columns);
    }, [containerWidth, columns]);

    const renderItem = useCallback((valueProposition: ValuePropositionWithRelations, index: number) => (
        <ValuePropositionCard
            valueProposition={valueProposition}
            onClick={onValuePropositionClick}
            visibleFields={visibleFields}
        />
    ), [onValuePropositionClick, visibleFields]);

    const getItemKey = useCallback((valueProposition: ValuePropositionWithRelations, index: number) =>
        valueProposition.id, []);

    const handleReorder = useCallback((reorderedData: ValuePropositionWithRelations[]) => {
        setItems(reorderedData);
        onValuePropositionReorder?.(reorderedData);
    }, [onValuePropositionReorder]);

    // Merge refs to handle both width and height measurements
    const mergedRef = useCallback((node: HTMLDivElement | null) => {
        if (containerRef.current !== node) {
            containerRef.current = node;
        }
        if (heightRef.current !== node) {
            heightRef.current = node;
        }
    }, [heightRef]);

    return (
        <div className="space-y-4" ref={mergedRef}>
            <VirtualGridDnd
                data={items}
                itemHeight="auto"
                itemWidth={itemWidth}
                columns={columns}
                gap={32}
                height={dynamicHeight}
                width="100%"
                overscan={3}
                renderItem={renderItem}
                getItemKey={getItemKey}
                onItemClick={onValuePropositionClick}
                onReorder={handleReorder}
                enableDragAndDrop={!!onValuePropositionReorder}
                className="w-full"
            />
        </div>
    );
}
