'use client';

import React, { useState, forwardRef, useMemo, useCallback, useRef, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DraggableCard } from '@/components/ui/draggable-card';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, GraduationCap, DollarSign, Quote, Tag, Search } from 'lucide-react';
import { Persona } from '@/lib/api/customer-segment';
import { VirtualGridDnd, useContainerWidth } from '@/components/ui/virtual-grid-dnd';
import { useVirtualizedGridHeight } from '@/hooks/use-dynamic-height';
import { isFieldVisible } from '@/lib/utils';


interface PersonaCardProps {
    persona: Persona;
    onClick?: (persona: Persona) => void;
    className?: string;
    visibleFields?: string[];
}

export function PersonaCard({
    persona,
    onClick,
    className = "",
    visibleFields = []
}: PersonaCardProps) {
    return (
        <DraggableCard
            id={persona.id}
            className={`
        cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] 
        border-l-4 border-l-green-500 bg-white h-full
        ${className}
      `}
            onClick={() => onClick?.(persona)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {persona.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            {isFieldVisible(visibleFields, 'name') && (
                                <CardTitle className="text-md font-semibold text-gray-900">
                                    {persona.name}
                                </CardTitle>
                            )}
                            {isFieldVisible(visibleFields, 'age') && persona.age && (
                                <p className="text-sm text-gray-500">
                                    {persona.age} years old
                                </p>
                            )}
                        </div>
                    </div>
                    {isFieldVisible(visibleFields, 'segment') && (
                        <Badge variant="outline" className="shrink-0">
                            {persona.segment.name}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
                {isFieldVisible(visibleFields, 'quote') && persona.quote && (
                    <div className="bg-gray-50 p-3 rounded-lg border-l-2 border-l-gray-300">
                        <div className="flex items-start gap-2">
                            <Quote className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <p className="text-sm italic text-gray-700 line-clamp-2">
                                "{persona.quote}"
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                    {isFieldVisible(visibleFields, 'location') && persona.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.location}</span>
                        </div>
                    )}

                    {isFieldVisible(visibleFields, 'education') && persona.education && (
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.education}</span>
                        </div>
                    )}

                    {isFieldVisible(visibleFields, 'gender') && persona.gender && (
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.gender}</span>
                        </div>
                    )}

                    {isFieldVisible(visibleFields, 'incomePerMonth') && persona.incomePerMonth && (
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.incomePerMonth}</span>
                        </div>
                    )}
                </div>

                {isFieldVisible(visibleFields, 'painPoints') && persona.painPoints && persona.painPoints.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-700">Pain Points</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {persona.painPoints.slice(0, 2).map((point, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-red-50 text-red-700 border-red-200"
                                >
                                    {point.length > 30 ? `${point.substring(0, 30)}...` : point}
                                </Badge>
                            ))}
                            {persona.painPoints.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{persona.painPoints.length - 2} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {isFieldVisible(visibleFields, 'channels') && persona.channels && persona.channels.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">Channels</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {persona.channels.slice(0, 3).map((channel, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                    {channel}
                                </Badge>
                            ))}
                            {persona.channels.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{persona.channels.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </DraggableCard>
    );
}



interface PersonaCardsProps {
    personas: Persona[];
    onPersonaClick?: (persona: Persona) => void;
    visibleFields?: string[];
    onPersonaReorder?: (reorderedPersonas: Persona[]) => void;
}

export default function PersonaCards({
    personas,
    onPersonaClick,
    visibleFields,
    onPersonaReorder
}: PersonaCardsProps) {
    const [items, setItems] = useState(personas);

    React.useEffect(() => {
        setItems(personas);
    }, [personas]);

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

        const gap = 16;
        const totalGaps = (columns - 1) * gap;
        const availableWidth = containerWidth - totalGaps;
        return Math.floor(availableWidth / columns);
    }, [containerWidth, columns]);

    const renderItem = useCallback((persona: Persona, index: number) => (
        <PersonaCard
            persona={persona}
            onClick={onPersonaClick}
            visibleFields={visibleFields}
        />
    ), [onPersonaClick, visibleFields]);

    const getItemKey = useCallback((persona: Persona, index: number) =>
        persona.id, []);

    const handleReorder = useCallback((reorderedData: Persona[]) => {
        setItems(reorderedData);
        onPersonaReorder?.(reorderedData);
    }, [onPersonaReorder]);

    // Merge refs to handle both width and height measurements
    const mergedRef = useCallback((node: HTMLDivElement | null) => {
        if (containerRef.current !== node) {
            containerRef.current = node;
        }
        if (heightRef.current !== node) {
            heightRef.current = node;
        }
    }, [heightRef]);

    useEffect(() => {
        console.log('dynamicHeight', dynamicHeight);
    }, [dynamicHeight]);

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
                onItemClick={onPersonaClick}
                onReorder={handleReorder}
                enableDragAndDrop={!!onPersonaReorder}
                className="w-full"
            />
        </div>
    );
}
