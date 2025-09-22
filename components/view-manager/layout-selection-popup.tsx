'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  Grid3X3,
  Kanban,
  X,
} from 'lucide-react';
import { ViewLayout } from '@/lib/api/views';

interface LayoutSelectionPopupProps {
  onClose: () => void;
  onLayoutSelect: (layout: ViewLayout) => void;
}

const LayoutOptions = [
  {
    layout: ViewLayout.CARD,
    icon: Grid3X3,
    title: 'Card View',
    description: 'Visual cards with persona details'
  },
  {
    layout: ViewLayout.TABLE,
    icon: Table,
    title: 'Table View',
    description: 'Structured data in columns'
  },
  {
    layout: ViewLayout.KANBAN,
    icon: Kanban,
    title: 'Kanban View',
    description: 'Organize by customer segments'
  },
];

export function LayoutSelectionPopup({ onClose, onLayoutSelect }: LayoutSelectionPopupProps) {
  const [selectedLayout, setSelectedLayout] = useState<ViewLayout | null>(null);

  const handleCreate = () => {
    if (selectedLayout) {
      onLayoutSelect(selectedLayout);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Choose Layout</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Select a layout for your new view. You can customize other settings after creation.
          </p>

          {LayoutOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedLayout === option.layout;

            return (
              <button
                key={option.layout}
                onClick={() => setSelectedLayout(option.layout)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors text-left ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <Icon className="h-8 w-8 text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.title}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedLayout}
          >
            Create View
          </Button>
        </div>
      </div>
    </div>
  );
}
