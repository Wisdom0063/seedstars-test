'use client';

import React, { useState, forwardRef, useMemo } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DraggableCard } from '@/components/ui/draggable-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, MapPin, GraduationCap, DollarSign, Quote, Tag, Search } from 'lucide-react';
import { Persona } from '@/lib/api/customer-segment';
import { VirtuosoGrid } from 'react-virtuoso';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';


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
    // Helper function to check if a field should be visible
    const isFieldVisible = (fieldName: string) => {
        return visibleFields.length === 0 || visibleFields.includes(fieldName);
    };
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
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {persona.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            {isFieldVisible('name') && (
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    {persona.name}
                                </CardTitle>
                            )}
                            {isFieldVisible('age') && persona.age && (
                                <p className="text-sm text-gray-500">
                                    {persona.age} years old
                                </p>
                            )}
                        </div>
                    </div>
                    {isFieldVisible('segment') && (
                        <Badge variant="outline" className="shrink-0">
                            {persona.segment.name}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
                {/* Quote */}
                {isFieldVisible('quote') && persona.quote && (
                    <div className="bg-gray-50 p-3 rounded-lg border-l-2 border-l-gray-300">
                        <div className="flex items-start gap-2">
                            <Quote className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <p className="text-sm italic text-gray-700 line-clamp-2">
                                "{persona.quote}"
                            </p>
                        </div>
                    </div>
                )}

                {/* Demographics */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {isFieldVisible('location') && persona.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.location}</span>
                        </div>
                    )}

                    {isFieldVisible('education') && persona.education && (
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.education}</span>
                        </div>
                    )}

                    {isFieldVisible('gender') && persona.gender && (
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.gender}</span>
                        </div>
                    )}

                    {isFieldVisible('incomePerMonth') && persona.incomePerMonth && (
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 truncate">{persona.incomePerMonth}</span>
                        </div>
                    )}
                </div>

                {/* Pain Points Preview */}
                {isFieldVisible('painPoints') && persona.painPoints && persona.painPoints.length > 0 && (
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

                {/* Channels Preview */}
                {isFieldVisible('channels') && persona.channels && persona.channels.length > 0 && (
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

// Grid components for VirtuosoGrid - keep outside component to prevent remounting
const gridComponents = {
    List: forwardRef<HTMLDivElement, { style?: React.CSSProperties; children?: React.ReactNode }>(
        ({ style, children, ...props }, ref) => (
            <div
                ref={ref}
                {...props}
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    ...style,
                }}
            >
                {children}
            </div>
        )
    ),
    Item: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => (
        <div
            {...props}
            style={{
                padding: "0.75rem",
                width: "33.333333%", // 3 columns
                display: "flex",
                flex: "none",
                alignContent: "stretch",
                boxSizing: "border-box",
            }}
        >
            {children}
        </div>
    )
};

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
    const [globalFilter, setGlobalFilter] = useState('');

    // Update items when personas prop changes
    React.useEffect(() => {
        setItems(personas);
    }, [personas]);



    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            onPersonaReorder?.(newItems);
        }
    }

    // Use virtualization only for large datasets to avoid drag/drop conflicts

    return (
        <div className="space-y-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items.map(p => p.id)} strategy={rectSortingStrategy}>
                    <VirtuosoGrid
                        style={{ height: 700, width: '100%' }}
                        totalCount={items.length}
                        components={gridComponents}
                        itemContent={(index) => (
                            <PersonaCard
                                persona={items[index]}
                                onClick={onPersonaClick}
                                visibleFields={visibleFields}
                            />
                        )}
                    />

                </SortableContext>
            </DndContext>
        </div>
    );
}
