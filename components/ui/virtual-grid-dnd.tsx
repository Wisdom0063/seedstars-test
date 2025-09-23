'use client';

import React, { useRef, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
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
  overscan = 5,
  renderItem,
  getItemKey,
  onItemClick,
  onReorder,
  enableDragAndDrop = false,
}: VirtualGridDndProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [rowHeights, setRowHeights] = React.useState<Map<number, number>>(new Map());

  // Calculate rows based on data length and columns
  const rowCount = Math.ceil(data.length / columns);

  // Calculate total width including gaps
  const totalItemWidth = itemWidth + gap;
  const totalGridWidth = columns * totalItemWidth - gap;
  
  // Ensure grid width matches container width when specified as percentage
  const gridWidth = width === '100%' ? '100%' : totalGridWidth;

  // Determine if we're using dynamic heights
  const isDynamicHeight = itemHeight === 'auto';
  const staticItemHeight = typeof itemHeight === 'number' ? itemHeight : 400;

  // Drag and drop sensors
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

  // Handle drag end
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

  // Function to get row height
  const getRowHeight = useCallback((rowIndex: number) => {
    if (!isDynamicHeight) return staticItemHeight + gap;
    const measuredHeight = rowHeights.get(rowIndex);
    return measuredHeight ? measuredHeight + gap : staticItemHeight + gap;
  }, [isDynamicHeight, staticItemHeight, gap, rowHeights]);

  // Row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: getRowHeight,
    overscan,
  });

  // Get visible rows
  const virtualRows = rowVirtualizer.getVirtualItems();

  // Memoized item keys for SortableContext
  const itemKeys = useMemo(() => 
    data.map((item, index) => getItemKey(item, index).toString()),
    [data, getItemKey]
  );

  // Effect to trigger virtualizer recalculation when row heights change
  React.useEffect(() => {
    if (isDynamicHeight && rowHeights.size > 0) {
      rowVirtualizer.measure();
    }
  }, [rowHeights, isDynamicHeight, rowVirtualizer]);

  // Callback to measure row height
  const measureRowHeight = useCallback((rowIndex: number, element: HTMLElement | null) => {
    if (!isDynamicHeight || !element) return;
    
    // Measure immediately for initial height
    const initialHeight = element.getBoundingClientRect().height;
    if (initialHeight > 0) {
      setRowHeights(prev => {
        const newMap = new Map(prev);
        if (newMap.get(rowIndex) !== initialHeight) {
          newMap.set(rowIndex, initialHeight);
          return newMap;
        }
        return prev;
      });
    }

    // Use ResizeObserver for ongoing measurement
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        if (height > 0) {
          setRowHeights(prev => {
            const newMap = new Map(prev);
            if (newMap.get(rowIndex) !== height) {
              newMap.set(rowIndex, height);
              return newMap;
            }
            return prev;
          });
        }
      }
    });

    resizeObserver.observe(element);
    
    // Cleanup function
    return () => {
      resizeObserver.disconnect();
    };
  }, [isDynamicHeight]);

  // Memoized render function for performance
  const renderGridItems = useMemo(() => {
    return virtualRows.map((virtualRow) => {
      const rowIndex = virtualRow.index;
      const rowItems = [];
      const measuredRowHeight = rowHeights.get(rowIndex);
      const currentRowHeight = measuredRowHeight || staticItemHeight;

      // Render items for this row
      for (let colIndex = 0; colIndex < columns; colIndex++) {
        const itemIndex = rowIndex * columns + colIndex;
        
        // Skip if we've exceeded the data length
        if (itemIndex >= data.length) break;

        const item = data[itemIndex];
        const itemKey = getItemKey(item, itemIndex);

        rowItems.push(
          <div
            key={`${virtualRow.key}-${colIndex}`}
            style={{
              position: 'absolute',
              top: 0,
              left: colIndex * totalItemWidth,
              width: itemWidth,
              height: isDynamicHeight ? currentRowHeight : staticItemHeight,
              minHeight: isDynamicHeight ? currentRowHeight : staticItemHeight,
            }}
            className="flex-shrink-0"
            onClick={() => onItemClick?.(item, itemIndex)}
          >
            <div style={{ 
              height: '100%', 
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {renderItem(item, itemIndex)}
            </div>
          </div>
        );
      }

      return (
        <div
          key={virtualRow.key}
          data-index={virtualRow.index}
          ref={(el) => measureRowHeight(rowIndex, el)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: totalGridWidth,
            height: isDynamicHeight ? currentRowHeight : staticItemHeight,
            minHeight: isDynamicHeight ? currentRowHeight : staticItemHeight,
            transform: `translateY(${virtualRow.start}px)`,
            marginBottom: gap,
          }}
          className="relative"
        >
          {rowItems}
        </div>
      );
    });
  }, [
    virtualRows,
    data,
    columns,
    itemWidth,
    totalItemWidth,
    totalGridWidth,
    renderItem,
    getItemKey,
    onItemClick,
    isDynamicHeight,
    staticItemHeight,
    gap,
    rowHeights,
    measureRowHeight,
  ]);

  const gridContent = (
    <div className={`relative ${className}`}>
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{
          height,
          width,
        }}
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: gridWidth,
            position: 'relative',
          }}
        >
          {renderGridItems}
        </div>
      </div>
    </div>
  );

  // Wrap with DnD context if enabled
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

// Hook for responsive columns
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

// Hook for container width observation
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
    
    // Set initial width
    setWidth(element.getBoundingClientRect().width);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return width;
}

export default VirtualGridDnd;
