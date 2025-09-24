'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ViewLayout } from '@/lib/api/views';
import { AllowedLayoutOptions, BaseDataItem, LayoutConfig } from './generic-view-manager';

interface LayoutSelectionPopupProps<T extends BaseDataItem> {
  onClose: () => void;
  onLayoutSelect: (layout: ViewLayout) => void;
  layouts: LayoutConfig<T>
}



export function LayoutSelectionPopup<T extends BaseDataItem>({ onClose, onLayoutSelect, layouts }: LayoutSelectionPopupProps<T>) {
  const [selectedLayout, setSelectedLayout] = useState<ViewLayout | null>(null);

  const layoutOptions = useMemo(() => AllowedLayoutOptions.filter(option => layouts[option.layout]), [layouts]);

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

          {layoutOptions.map((option) => {
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
                  <div className="font-medium text-gray-900">{option.label} View</div>
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
