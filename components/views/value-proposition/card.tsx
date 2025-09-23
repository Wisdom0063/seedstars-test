'use client';

import React, { useState, forwardRef, useMemo } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DraggableCard } from '@/components/ui/draggable-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lightbulb, Users, Target, Tag, Search } from 'lucide-react';
import { ValuePropositionWithRelations } from '@/lib/api/value-proposition';
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
    // Helper function to check if a field should be visible
    const isFieldVisible = (fieldName: string) => {
        return visibleFields.length === 0 || visibleFields.includes(fieldName);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'border-l-green-500 bg-green-50';
            case 'DRAFT':
                return 'border-l-yellow-500 bg-yellow-50';
            case 'ARCHIVED':
                return 'border-l-gray-500 bg-gray-50';
            default:
                return 'border-l-blue-500 bg-blue-50';
        }
    };

    return (
        <DraggableCard
            id={valueProposition.id}
            className={`
        cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] 
        border-l-4 ${getStatusColor(valueProposition.status)} h-full
        ${className}
      `}
            onClick={() => onClick?.(valueProposition)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            <Lightbulb className="h-5 w-5" />
                        </div>
                        <div>
                            {isFieldVisible('name') && (
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    {valueProposition.name}
                                </CardTitle>
                            )}
                            {isFieldVisible('status') && (
                                <Badge 
                                    variant={valueProposition.status === 'ACTIVE' ? 'default' : 'secondary'}
                                    className="text-xs mt-1"
                                >
                                    {valueProposition.status}
                                </Badge>
                            )}
                        </div>
                    </div>
                    {isFieldVisible('segment') && (
                        <Badge variant="outline" className="shrink-0">
                            {valueProposition.segment.name}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
                {/* Description */}
                {isFieldVisible('description') && valueProposition.description && (
                    <div className="bg-gray-50 p-3 rounded-lg border-l-2 border-l-gray-300">
                        <p className="text-sm text-gray-700 line-clamp-2">
                            {valueProposition.description}
                        </p>
                    </div>
                )}

                {/* Persona */}
                {isFieldVisible('persona') && valueProposition.persona && (
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate">{valueProposition.persona.name}</span>
                    </div>
                )}

                {/* Value Proposition Statements Preview */}
                {isFieldVisible('valuePropositionStatements') && valueProposition.valuePropositionStatements && valueProposition.valuePropositionStatements.length > 0 && (
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

                {/* Customer Jobs Preview */}
                {isFieldVisible('customerJobs') && valueProposition.customerJobs && valueProposition.customerJobs.length > 0 && (
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

                {/* Customer Pains Preview */}
                {isFieldVisible('customerPains') && valueProposition.customerPains && valueProposition.customerPains.length > 0 && (
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

                {/* Products/Services Preview */}
                {isFieldVisible('productsServices') && valueProposition.productsServices && valueProposition.productsServices.length > 0 && (
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
    Item: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
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
    const [globalFilter, setGlobalFilter] = useState('');

    // Update items when valuePropositions prop changes
    React.useEffect(() => {
        setItems(valuePropositions);
    }, [valuePropositions]);

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
            onValuePropositionReorder?.(newItems);
        }
    }

    return (
        <div className="space-y-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items.map(vp => vp.id)} strategy={rectSortingStrategy}>
                    <VirtuosoGrid
                        style={{ height: 700, width: '100%' }}
                        totalCount={items.length}
                        components={gridComponents}
                        itemContent={(index) => (
                            <ValuePropositionCard
                                valueProposition={items[index]}
                                onClick={onValuePropositionClick}
                                visibleFields={visibleFields}
                            />
                        )}
                    />
                </SortableContext>
            </DndContext>
        </div>
    );
}
