'use client';

import React, { useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';


interface Option {
  id: string;
  label: string;
  value: any;
  count: number;
}

interface VirtualizedMultiSelectProps {
  options: Option[];
  value: any[];
  onUpdate: (value: any[]) => void;
  label: string;
  searchPlaceholder?: string;
}

interface OptionItemProps {
  option: Option;
  isSelected: boolean;
  onToggle: (optionValue: any) => void;
}

function OptionItem({ option, isSelected, onToggle }: OptionItemProps) {
  return (
    <label className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded mx-2">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(option.value)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="flex-1 truncate">{option.label}</span>
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
        {option.count}
      </span>
    </label>
  );
}

export function VirtualizedMultiSelect({
  options,
  value,
  onUpdate,
  label,
  searchPlaceholder = "Search options..."
}: VirtualizedMultiSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;

    const query = searchQuery.toLowerCase();
    return options.filter(option =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const handleToggle = (optionValue: any) => {
    const newValue = Array.isArray(value) ? [...value] : [];
    const index = newValue.indexOf(optionValue);

    if (index > -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(optionValue);
    }

    onUpdate(newValue);
  };

  const selectedCount = Array.isArray(value) ? value.length : 0;
  const totalCount = options.length;

  return (
    <div className="w-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-700">
            Select values for {label}
          </div>
          <div className="text-xs text-gray-500">
            {selectedCount} of {totalCount} selected
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-8"
          />
        </div>

        {searchQuery && (
          <div className="text-xs text-gray-500 mt-2">
            {filteredOptions.length} of {totalCount} options shown
          </div>
        )}
      </div>

      <div className="h-80">
        {filteredOptions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            {searchQuery ? 'No options found' : 'No options available'}
          </div>
        ) : (
          <Virtuoso
            style={{ height: '100%' }}
            data={filteredOptions}
            itemContent={(index, option) => (
              <OptionItem
                key={option.id}
                option={option}
                isSelected={Array.isArray(value) && value.includes(option.value)}
                onToggle={handleToggle}
              />
            )}
            components={{
              List: React.forwardRef<HTMLDivElement>((props, ref) => (
                <div {...props} ref={ref} className="py-2" />
              )),
            }}
          />
        )}
      </div>

      {selectedCount > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => onUpdate([])}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
