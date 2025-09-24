'use client';

import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  X,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { ViewSource } from '@/lib/api/views';
import { SortCriteria } from './generic-view-manager';

interface ActiveSortBarProps {
  sorts: SortCriteria[];
  onSortsChange: (sorts: SortCriteria[]) => void;
  source: ViewSource;
}

export function ActiveSortBar({ sorts, onSortsChange, source }: ActiveSortBarProps) {
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

  if (sorts.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
      <div className="flex flex-wrap gap-2">
        {sorts.map((sort, index) => (
          <SortChip
            key={sort.id}
            sort={sort}
            index={index}
            onOrderChange={(order) => updateSortOrder(sort.id, order)}
            onRemove={() => removeSort(sort.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface SortChipProps {
  sort: SortCriteria;
  index: number;
  onOrderChange: (order: 'ASC' | 'DESC') => void;
  onRemove: () => void;
}

function SortChip({ sort, index, onOrderChange, onRemove }: SortChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = sort.icon;

  const getOrderText = () => {
    return sort.order === 'ASC' ? 'Ascending' : 'Descending';
  };

  const getOrderIcon = () => {
    return sort.order === 'ASC' ? ArrowUp : ArrowDown;
  };

  const OrderIcon = getOrderIcon();

  return (
    <div className="w-48 bg-white border border-blue-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
            {index + 1}
          </span>
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-700">{sort.label}</span>
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <OrderIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">{getOrderText()}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-48 p-0">
          <div className="p-2">
            <button
              onClick={() => {
                onOrderChange('ASC');
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors ${sort.order === 'ASC' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
            >
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm">Ascending</span>
              {sort.order === 'ASC' && (
                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => {
                onOrderChange('DESC');
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors ${sort.order === 'DESC' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
            >
              <ArrowDown className="h-4 w-4" />
              <span className="text-sm">Descending</span>
              {sort.order === 'DESC' && (
                <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
