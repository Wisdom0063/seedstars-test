'use client';

import React, { useMemo, useCallback, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
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

export interface VirtualGridDndProps<T> {
    data: T[];
    itemHeight?: number | 'auto';
    itemWidth?: number;
    columns?: number;
    gap?: number;
    height?: number | string;
    width?: number | string;
    className?: string;
    overscan?: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    getItemKey: (item: T, index: number) => string | number;
    onItemClick?: (item: T, index: number) => void;
    onReorder?: (reorderedData: T[]) => void;
    enableDragAndDrop?: boolean;
}

export function VirtualGridDnd<T>({
    data,
    itemHeight = 300,
    itemWidth = 350,
    columns = 3,
    gap = 16,
    height = 600,
    width = '100%',
    className = '',
    overscan = 10,
    renderItem,
    getItemKey,
    onItemClick,
    onReorder,
    enableDragAndDrop = false,
}: VirtualGridDndProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const groupedData = useMemo(() => {
        const rows: T[][] = [];
        for (let i = 0; i < data.length; i += columns) {
            rows.push(data.slice(i, i + columns));
        }
        return rows;
    }, [data, columns]);

    const actualItemWidth = useMemo(() => {
        if (typeof width === 'string' && width.includes('%')) {
            return `calc((100% - ${(columns - 1) * gap}px) / ${columns})`;
        }
        return itemWidth;
    }, [width, itemWidth, gap, columns]);

    const isDynamicHeight = itemHeight === 'auto';
    const staticItemHeight = typeof itemHeight === 'number' ? itemHeight : 300;

    const itemKeys = useMemo(() =>
        data.map((item, index) => getItemKey(item, index).toString()),
        [data, getItemKey]
    );

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

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id && onReorder) {
            const oldIndex = data.findIndex((item, index) =>
                getItemKey(item, index).toString() === active.id
            );
            const newIndex = data.findIndex((item, index) =>
                getItemKey(item, index).toString() === over?.id
            );

            if (oldIndex !== -1 && newIndex !== -1) {
                const newData = arrayMove(data, oldIndex, newIndex);
                onReorder(newData);
            }
        }
    }, [data, getItemKey, onReorder]);

    const renderRowContent = useCallback((rowIndex: number, rowData: T[]) => {
        return (
            <div
                className="flex"
                style={{
                    gap: `${gap}px`,
                    padding: `${gap / 2}px`,
                    height: isDynamicHeight ? 'auto' : staticItemHeight,
                    minHeight: isDynamicHeight ? 'auto' : staticItemHeight,
                }}
            >
                {rowData.map((item, colIndex) => {
                    const itemIndex = rowIndex * columns + colIndex;
                    return (
                        <div
                            key={getItemKey(item, itemIndex)}
                            style={{
                                width: actualItemWidth,
                                flex: '0 0 auto'
                            }}
                            onClick={() => onItemClick?.(item, itemIndex)}
                        >
                            {renderItem(item, itemIndex)}
                        </div>
                    );
                })}
            </div>
        );
    }, [actualItemWidth, gap, isDynamicHeight, staticItemHeight, columns, renderItem, getItemKey, onItemClick]);

    const itemContent = useCallback((index: number) => {
        const rowData = groupedData[index];
        if (!rowData) return null;
        return renderRowContent(index, rowData);
    }, [groupedData, renderRowContent]);

    const virtuosoComponents = useMemo(() => ({
        List: React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
            ({ style, children, ...props }, ref) => (
                <div
                    ref={ref}
                    {...props}
                    style={{
                        ...style,
                        width: '100%',
                    }}
                >
                    {children}
                </div>
            )
        ),
        Item: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => (
            <div {...props} style={{ width: '100%' }}>
                {children}
            </div>
        )
    }), []);

    const gridContent = (
        <div className={`relative ${className}`} ref={containerRef}>
            <Virtuoso
                style={{
                    height: typeof height === 'number' ? `${height}px` : height,
                    width: typeof width === 'number' ? `${width}px` : width,
                }}
                totalCount={groupedData.length}
                itemContent={itemContent}
                components={virtuosoComponents}
                overscan={overscan}
                fixedItemHeight={isDynamicHeight ? undefined : staticItemHeight + gap}
            />
        </div>
    );

    if (enableDragAndDrop) {
        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={itemKeys} strategy={rectSortingStrategy}>
                    {gridContent}
                </SortableContext>
            </DndContext>
        );
    }

    return gridContent;
}

export function useResponsiveColumns(
    containerWidth: number,
    itemWidth: number,
    gap: number = 16,
    minColumns: number = 1,
    maxColumns: number = 6
): number {
    return useMemo(() => {
        if (containerWidth <= 0) return minColumns;

        const availableWidth = containerWidth - gap;
        const itemWithGap = itemWidth + gap;
        const calculatedColumns = Math.floor(availableWidth / itemWithGap);

        return Math.max(minColumns, Math.min(maxColumns, calculatedColumns));
    }, [containerWidth, itemWidth, gap, minColumns, maxColumns]);
}

export function useContainerWidth(ref: React.RefObject<HTMLElement | null>): number {
    const [width, setWidth] = React.useState(0);

    React.useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });

        resizeObserver.observe(element);

        setWidth(element.getBoundingClientRect().width);

        return () => {
            resizeObserver.disconnect();
        };
    }, [ref]);

    return width;
}

export default VirtualGridDnd;