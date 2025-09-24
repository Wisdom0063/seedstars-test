'use client';

import React, { useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Input } from '@/components/ui/input';
import { Search, Check } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  value: any;
  count: number;
}

interface VirtualizedSelectProps {
  options: Option[];
  value: any;
  onUpdate: (value: any) => void;
  label: string;
  searchPlaceholder?: string;
  allowClear?: boolean;
}

interface OptionItemProps {
  option: Option;
  isSelected: boolean;
  onSelect: (optionValue: any) => void;
}

function OptionItem({ option, isSelected, onSelect }: OptionItemProps) {
  return (
    <button
      onClick={() => onSelect(option.value)}
      className="w-full flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded mx-2 text-left"
    >
      <div className="w-4 h-4 flex items-center justify-center">
        {isSelected && <Check className="h-3 w-3 text-blue-600" />}
      </div>
      <span className="flex-1 truncate">{option.label}</span>
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
        {option.count}
      </span>
    </button>
  );
}

export function VirtualizedSelect({
  options,
  value,
  onUpdate,
  label,
  searchPlaceholder = "Search options...",
  allowClear = true
}: VirtualizedSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    
    const query = searchQuery.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const handleSelect = (optionValue: any) => {
    onUpdate(optionValue);
  };

  const handleClear = () => {
    onUpdate(null);
  };

  const selectedOption = options.find(option => option.value === value);
  const totalCount = options.length;

  return (
    <div className="w-80">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-700">
            Select value for {label}
          </div>
          {selectedOption && (
            <div className="text-xs text-gray-500">
              Selected: {selectedOption.label}
            </div>
          )}
        </div>
        
        {/* Search Input */}
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

      {/* Virtualized Options List */}
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
                isSelected={option.value === value}
                onSelect={handleSelect}
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

      {/* Footer with clear option */}
      {allowClear && value && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClear}
            className="text-xs text-red-600 hover:text-red-800 font-medium"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
