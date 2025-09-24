'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ArrowUpDown,
  Plus,
  Trash2,
  X,
  GripVertical,
  ChevronDown,
} from 'lucide-react';
import { ViewSource, ViewSortCriteria } from '@/lib/api/views';

interface SortDropdownProps {
  sorts: ViewSortCriteria[];
  onSortsChange: (sorts: ViewSortCriteria[]) => void;
  source: ViewSource;
  availableFields: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    field: string;
    type: 'text' | 'number' | 'date';
  }>;
  onAddSort: (field: any) => void;
}

export function SortDropdown({ sorts, onSortsChange, source, availableFields, onAddSort }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const removeSort = (sortId: string) => {
    const newSorts = sorts.filter(sort => sort.id !== sortId);
    onSortsChange(newSorts);
  };

  const updateSortOrder = (sortId: string, order: 'ASC' | 'DESC') => {
    const newSorts = sorts.map(sort =>
      sort.id === sortId ? { ...sort, order } : sort
    );
    onSortsChange(newSorts);
  };

  const clearAllSorts = () => {
    onSortsChange([]);
  };

  const sortCount = sorts.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-8 ${sortCount > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
        >
          <ArrowUpDown className="h-4 w-4 mr-1.5" />
          {sortCount > 0 ? `${sortCount} sort${sortCount > 1 ? 's' : ''}` : 'Sort'}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-0">
        {sortCount > 0 ? (
          <div className="p-4">
            <div className="space-y-3">
              {sorts.map((sort, index) => {
                const Icon = sort.icon;
                return (
                  <div key={sort.id} className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-gray-400" />

                    <div className="flex items-center gap-2 flex-1">
                      {/* {Icon && <Icon className="h-4 w-4 text-gray-500" />} */}
                      <span className="text-sm font-medium text-gray-700">
                        {sort.label}
                      </span>
                    </div>

                    <select
                      value={sort.order}
                      onChange={(e) => updateSortOrder(sort.id, e.target.value as 'ASC' | 'DESC')}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                    >
                      <option value="ASC">Ascending</option>
                      <option value="DESC">Descending</option>
                    </select>

                    <button
                      onClick={() => removeSort(sort.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Plus className="h-4 w-4 mr-1" />
                    Add sort
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-2">
                  <div className="space-y-1">
                    {availableFields
                      .filter(field => !sorts.some(sort => sort.field === field.field))
                      .map((field) => {
                        const Icon = field.icon;
                        return (
                          <button
                            key={field.id}
                            onClick={() => {
                              onAddSort(field);
                            }}
                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded text-left"
                          >
                            <Icon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{field.label}</span>
                          </button>
                        );
                      })}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllSorts}
                className="text-gray-600 hover:text-gray-900"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete sort
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-3">No sorts applied</div>
            <div className="space-y-1">
              {availableFields.map((field) => {
                const Icon = field.icon;
                return (
                  <button
                    key={field.id}
                    onClick={() => {
                      onAddSort(field);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded text-left"
                  >
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{field.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
