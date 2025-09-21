'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table,
  Grid3X3,
  Kanban,
} from 'lucide-react';
import { ViewLayout } from '@/lib/api/views';

interface LayoutSwitcherProps {
  currentLayout: ViewLayout;
  onLayoutChange: (layout: ViewLayout) => void;
  disabled?: boolean;
}

const layouts = [
  {
    value: ViewLayout.CARD,
    icon: Grid3X3,
    label: 'Card',
    tooltip: 'Card view',
  },
  {
    value: ViewLayout.TABLE,
    icon: Table,
    label: 'Table',
    tooltip: 'Table view',
  },
  {
    value: ViewLayout.KANBAN,
    icon: Kanban,
    label: 'Kanban',
    tooltip: 'Kanban view',
  },
];

export function LayoutSwitcher({
  currentLayout,
  onLayoutChange,
  disabled = false,
}: LayoutSwitcherProps) {
  return (
    <div className="flex items-center border rounded-md bg-white">
      {layouts.map((layout, index) => {
        const Icon = layout.icon;
        const isActive = currentLayout === layout.value;
        const isFirst = index === 0;
        const isLast = index === layouts.length - 1;
        
        return (
          <Button
            key={layout.value}
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onLayoutChange(layout.value)}
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
