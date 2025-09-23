'use client';

import React, { useRef, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface VirtualGridProps<T> {
  data: T[];
  itemHeight?: number;
  itemWidth?: number;
  columns?: number;
  gap?: number;
  height?: number | string;
  width?: number | string;
  className?: string;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  onItemClick?: (item: T, index: number) => void;
}

export function VirtualGrid<T>({
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
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate rows based on data length and columns
  const rowCount = Math.ceil(data.length / columns);

  // Calculate total width including gaps
  const totalItemWidth = itemWidth + gap;
  const totalGridWidth = columns * totalItemWidth - gap;

  // Row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight + gap,
    overscan,
  });

  // Get visible rows
  const virtualRows = rowVirtualizer.getVirtualItems();

  // Memoized render function for performance
  const renderGridItems = useMemo(() => {
    return virtualRows.map((virtualRow) => {
      const rowIndex = virtualRow.index;
      const rowItems = [];

      // Render items for this row
      for (let colIndex = 0; colIndex < columns; colIndex++) {
        const itemIndex = rowIndex * columns + colIndex;
        
        // Skip if we've exceeded the data length
        if (itemIndex >= data.length) break;

        const item = data[itemIndex];
        const itemKey = getItemKey ? getItemKey(item, itemIndex) : itemIndex;

        rowItems.push(
          <div
            key={`${virtualRow.key}-${colIndex}`}
            style={{
              position: 'absolute',
              top: 0,
              left: colIndex * totalItemWidth,
              width: itemWidth,
              height: itemHeight,
            }}
            className="flex-shrink-0"
            onClick={() => onItemClick?.(item, itemIndex)}
          >
            {renderItem(item, itemIndex)}
          </div>
        );
      }

      return (
        <div
          key={virtualRow.key}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: totalGridWidth,
            height: itemHeight,
            transform: `translateY(${virtualRow.start}px)`,
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
    itemHeight,
    itemWidth,
    totalItemWidth,
    totalGridWidth,
    renderItem,
    getItemKey,
    onItemClick,
  ]);

  return (
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
            width: totalGridWidth,
            position: 'relative',
          }}
        >
          {renderGridItems}
        </div>
      </div>
    </div>
  );
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
export function useContainerWidth(ref: React.RefObject<HTMLElement>): number {
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

export default VirtualGrid;
