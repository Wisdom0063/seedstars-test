'use client';

import { useState, useEffect, useRef } from 'react';

interface UseDynamicHeightOptions {
  /** Additional offset to subtract from calculated height (in pixels) */
  offset?: number;
  /** Minimum height to ensure (in pixels) */
  minHeight?: number;
  /** Maximum height to cap at (in pixels) */
  maxHeight?: number;
}

/**
 * Custom hook to calculate dynamic height for virtualized components
 * Takes into account viewport height and subtracts space used by fixed elements
 */
export function useDynamicHeight(options: UseDynamicHeightOptions = {}) {
  const { offset = 0, minHeight = 400, maxHeight } = options;
  const [height, setHeight] = useState(minHeight);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current) return;

      // Get the container's position relative to viewport
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate available height from current position to bottom of viewport
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - rect.top - offset;
      
      // Apply constraints
      let finalHeight = Math.max(availableHeight, minHeight);
      if (maxHeight) {
        finalHeight = Math.min(finalHeight, maxHeight);
      }
      
      setHeight(finalHeight);
    };

    // Calculate initial height
    calculateHeight();

    // Recalculate on window resize
    const handleResize = () => {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(calculateHeight);
    };

    window.addEventListener('resize', handleResize);
    
    // Also recalculate when container position might change
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [offset, minHeight, maxHeight]);

  return { height, containerRef };
}

/**
 * Hook specifically for virtualized grids that accounts for common UI elements
 */
export function useVirtualizedGridHeight(options: UseDynamicHeightOptions = {}) {
  // Default offset accounts for:
  // - Bottom padding/margin: ~32px
  // - Potential scrollbar space: ~16px  
  // - Buffer for smooth scrolling: ~32px
  const defaultOffset = 80;
  
  return useDynamicHeight({
    offset: defaultOffset + (options.offset || 0),
    minHeight: options.minHeight || 400,
    maxHeight: options.maxHeight,
  });
}
