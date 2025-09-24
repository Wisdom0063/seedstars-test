'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Settings,
  Star,
  Table,
  Grid3X3,
  Kanban
} from 'lucide-react';
import { View, ViewLayout, ViewSource } from '@/lib/api/views';
import { ViewSettingsPopover } from './view-settings-popover';

interface ViewSelectorProps {
  views: View[];
  currentView: View;
  onViewChange: (view: View) => void;
  onCreateView: () => void;
  onEditView: (view: View) => void;
  onLayoutChange: (layout: ViewLayout) => void;
  source: ViewSource;
  availableProperties: Array<{ id: string; label: string }>;
}

const LayoutIcons = {
  [ViewLayout.CARD]: Grid3X3,
  [ViewLayout.TABLE]: Table,
  [ViewLayout.KANBAN]: Kanban,
};

export function ViewSelector({
  views,
  currentView,
  onViewChange,
  onCreateView,
  onEditView,
  onLayoutChange,
  source,
  availableProperties,
}: ViewSelectorProps) {
  const filteredViews = views.filter(view => view.source === source);

  return (
    <>
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        {filteredViews.map((view) => {
          const LayoutIcon = LayoutIcons[view.layout];
          const isActive = view.id === currentView.id;

          return (
            <div key={view.id} className="relative group">
              <button
                onClick={() => onViewChange(view)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
              >
                <LayoutIcon className="h-4 w-4" />
                <span>{view.name}</span>
                {view.isDefault && (
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                )}
              </button>

              <ViewSettingsPopover
                view={view}
                onLayoutChange={onLayoutChange}
                onViewUpdate={(updatedView) => {
                  onViewChange(updatedView);
                }}
                availableProperties={availableProperties}
              >
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Settings className="h-3 w-3 text-gray-600" />
                </button>
              </ViewSettingsPopover>
            </div>
          );
        })}

        <button
          onClick={onCreateView}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-white/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New</span>
        </button>
      </div>

    </>
  );
}

