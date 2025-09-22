'use client';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  Grid3X3,
  Kanban,
} from 'lucide-react';
import { ViewLayout } from '@/lib/api/views';
import { LayoutConfig, BaseDataItem, AllowedLayoutOptions } from './generic-view-manager';

interface LayoutSwitcherProps<T extends BaseDataItem> {
  currentLayout: ViewLayout;
  onLayoutChange: (layout: ViewLayout) => void;
  disabled?: boolean;
  layouts: LayoutConfig<T>

}

export function LayoutSwitcher<T extends BaseDataItem>({
  currentLayout,
  onLayoutChange,
  disabled = false,
  layouts,
}: LayoutSwitcherProps<T>) {
  const layoutOptions = useMemo(() => AllowedLayoutOptions.filter(option => layouts[option.layout]), [layouts]);

  return (
    <div className="flex items-center border rounded-md bg-white">
      {layoutOptions.map((layout, index) => {
        const Icon = layout.icon;
        const isActive = currentLayout === layout.layout;
        const isFirst = index === 0;
        const isLast = index === layoutOptions.length - 1;

        return (
          <Button
            key={layout.layout}
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onLayoutChange(layout.layout)}
            className={`
              h-8 px-3 rounded-none border-r last:border-r-0
              ${isFirst ? 'rounded-l-md' : ''}
              ${isLast ? 'rounded-r-md' : ''}
              ${isActive
                ? 'bg-gray-100 text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
            title={layout.tooltip}
          >
            <Icon className="h-4 w-4" />
            <span className="ml-1.5 text-xs font-medium hidden sm:inline">
              {layout.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
