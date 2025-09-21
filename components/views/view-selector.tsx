'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  Plus,
  Settings,
  Star,
  Table,
  Grid3X3,
  Kanban,
  Eye
} from 'lucide-react';
import { View, ViewLayout, ViewSource } from '@/lib/api/views';

interface ViewSelectorProps {
  views: View[];
  currentView: View;
  onViewChange: (view: View) => void;
  onCreateView: () => void;
  onEditView: (view: View) => void;
  source: ViewSource;
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
  source,
}: ViewSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredViews = views.filter(view => view.source === source);
  const CurrentLayoutIcon = LayoutIcons[currentView.layout];

  return (
    <div className="flex items-center gap-2">
      {/* Current View Display */}
      <div className="flex items-center gap-2">
        <CurrentLayoutIcon className="h-4 w-4 text-gray-600" />
        <span className="font-medium text-gray-900">{currentView.name}</span>
        {currentView.isDefault && (
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
        )}
      </div>

      {/* View Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64">
          <div className="px-2 py-1.5">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Views
            </div>
          </div>

          {filteredViews.map((view) => {
            const LayoutIcon = LayoutIcons[view.layout];
            const isActive = view.id === currentView.id;

            return (
              <DropdownMenuItem
                key={view.id}
                onClick={() => {
                  alert("view changed")
                  onViewChange(view);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${isActive ? 'bg-blue-50 text-blue-700' : ''
                  }`}
              >
                <LayoutIcon className="h-4 w-4 text-gray-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{view.name}</span>
                    {view.isDefault && (
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    )}
                  </div>
                  {view.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {view.description}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditView(view);
                  }}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              onCreateView();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer text-blue-600"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">New view</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
