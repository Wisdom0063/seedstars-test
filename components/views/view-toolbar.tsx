'use client';

import React from 'react';
import { ViewSelector } from './view-selector';
import { LayoutSwitcher } from './layout-switcher';
import { Button } from '@/components/ui/button';
import { 
  Filter,
  SortAsc,
  Search,
  MoreHorizontal,
} from 'lucide-react';
import { View, ViewLayout, ViewSource } from '@/lib/api/views';

interface ViewToolbarProps {
  views: View[];
  currentView: View;
  onViewChange: (view: View) => void;
  onLayoutChange: (layout: ViewLayout) => void;
  onCreateView: () => void;
  onEditView: (view: View) => void;
  source: ViewSource;
  itemCount?: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function ViewToolbar({
  views,
  currentView,
  onViewChange,
  onLayoutChange,
  onCreateView,
  onEditView,
  source,
  itemCount,
  searchValue,
  onSearchChange,
}: ViewToolbarProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b bg-white">
      {/* Left side - View selector and layout switcher */}
      <div className="flex items-center gap-4">
        <ViewSelector
          views={views}
          currentView={currentView}
          onViewChange={onViewChange}
          onCreateView={onCreateView}
          onEditView={onEditView}
          source={source}
        />
        
        <div className="h-4 w-px bg-gray-300" />
        
        <LayoutSwitcher
          currentLayout={currentView.layout}
          onLayoutChange={onLayoutChange}
        />
      </div>

      {/* Right side - Search and actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        )}

        {/* Filter button */}
        <Button variant="outline" size="sm" className="h-8">
          <Filter className="h-4 w-4 mr-1.5" />
          Filter
        </Button>

        {/* Sort button */}
        <Button variant="outline" size="sm" className="h-8">
          <SortAsc className="h-4 w-4 mr-1.5" />
          Sort
        </Button>

        {/* More options */}
        <Button variant="outline" size="sm" className="h-8 px-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>

        {/* Item count */}
        {itemCount !== undefined && (
          <div className="text-sm text-gray-500 ml-2">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </div>
        )}
      </div>
    </div>
  );
}
