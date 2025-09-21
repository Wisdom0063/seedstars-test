'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Star,
  Table,
  Grid3X3,
  Kanban,
  Eye,
  X,
  ChevronRight
} from 'lucide-react';
import { View, ViewLayout } from '@/lib/api/views';

interface ViewSettingsModalProps {
  view: View;
  onClose: () => void;
  onLayoutChange: (layout: ViewLayout) => void;
  onEditView: (view: View) => void;
}

const LayoutIcons = {
  [ViewLayout.CARD]: Grid3X3,
  [ViewLayout.TABLE]: Table,
  [ViewLayout.KANBAN]: Kanban,
};

export function ViewSettingsModal({ view, onClose, onLayoutChange, onEditView }: ViewSettingsModalProps) {
  const [selectedLayout, setSelectedLayout] = useState(view.layout);
  const [viewName, setViewName] = useState(view.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [visibleFields, setVisibleFields] = useState<string[]>(
    view.visibleFields || []
  );
  const [showPropertyVisibility, setShowPropertyVisibility] = useState(false);

  // Available properties for personas
  const availableProperties = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
    { id: 'gender', label: 'Gender' },
    { id: 'location', label: 'Location' },
    { id: 'education', label: 'Education' },
    { id: 'incomePerMonth', label: 'Income Level' },
    { id: 'painPoints', label: 'Pain Points' },
    { id: 'channels', label: 'Channels' },
    { id: 'quote', label: 'Quote' },
    { id: 'description', label: 'Description' },
    { id: 'segment', label: 'Customer Segment' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'updatedAt', label: 'Updated At' },
  ];

  const handleLayoutChange = (layout: ViewLayout) => {
    setSelectedLayout(layout);
    onLayoutChange(layout);
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    // TODO: Call API to update view name
    console.log('Updating view name to:', viewName);
  };

  const togglePropertyVisibility = (propertyId: string) => {
    setVisibleFields(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSave = () => {
    // TODO: Call API to save all changes
    console.log('Saving view changes:', {
      name: viewName,
      layout: selectedLayout,
      visibleFields
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">View settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* View Name */}
          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
            <Star className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              {isEditingName ? (
                <input
                  type="text"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave();
                    if (e.key === 'Escape') {
                      setViewName(view.name);
                      setIsEditingName(false);
                    }
                  }}
                  className="font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  autoFocus
                />
              ) : (
                <div 
                  className="font-medium text-gray-900 cursor-pointer"
                  onClick={() => setIsEditingName(true)}
                >
                  {viewName}
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsEditingName(true)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Settings className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Layout */}
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <Grid3X3 className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-900">Layout</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="capitalize">{selectedLayout.toLowerCase()}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Layout Options */}
          <div className="pl-8 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(LayoutIcons).map(([layout, Icon]) => (
                <button
                  key={layout}
                  onClick={() => handleLayoutChange(layout as ViewLayout)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                    selectedLayout === layout
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-6 w-6 text-gray-600" />
                  <span className="text-sm font-medium capitalize">
                    {layout.toLowerCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Property Visibility */}
          <div>
            <div 
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => setShowPropertyVisibility(!showPropertyVisibility)}
            >
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">Property visibility</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <span>{visibleFields.length}</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${showPropertyVisibility ? 'rotate-90' : ''}`} />
              </div>
            </div>

            {/* Property List */}
            {showPropertyVisibility && (
              <div className="pl-8 space-y-2 mt-2">
                {availableProperties.map((property) => {
                  const isVisible = visibleFields.includes(property.id);
                  return (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => togglePropertyVisibility(property.id)}
                    >
                      <span className="text-sm text-gray-700">{property.label}</span>
                      <button
                        className={`p-1 rounded transition-colors ${
                          isVisible 
                            ? 'text-blue-600 hover:bg-blue-50' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <Eye className={`h-4 w-4 ${isVisible ? '' : 'opacity-50'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
