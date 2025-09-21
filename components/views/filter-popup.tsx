'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { 
  Filter,
  Search,
  User,
  MapPin,
  GraduationCap,
  DollarSign,
  Users,
  Heart,
  MessageCircle,
  Calendar,
  Hash,
} from 'lucide-react';
import { ViewSource } from '@/lib/api/views';

interface FilterField {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'text' | 'multiselect' | 'range' | 'date';
  description?: string;
}

interface FilterPopupProps {
  source: ViewSource;
  activeFilters: Record<string, any>;
  onAddFilter: (filterId: string) => void;
}

// Define available filter fields based on source
const getFilterFields = (source: ViewSource): FilterField[] => {
  const commonFields: FilterField[] = [
    {
      id: 'segments',
      label: 'Customer Segment',
      icon: Users,
      type: 'multiselect',
      description: 'Filter by customer segment'
    },
    {
      id: 'locations',
      label: 'Location',
      icon: MapPin,
      type: 'multiselect',
      description: 'Filter by location'
    },
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCap,
      type: 'multiselect',
      description: 'Filter by education level'
    },
    {
      id: 'income',
      label: 'Income Level',
      icon: DollarSign,
      type: 'multiselect',
      description: 'Filter by income range'
    },
    {
      id: 'ageRange',
      label: 'Age Range',
      icon: User,
      type: 'range',
      description: 'Filter by age range'
    },
    {
      id: 'painPoints',
      label: 'Pain Points',
      icon: Heart,
      type: 'multiselect',
      description: 'Filter by pain points'
    },
    {
      id: 'channels',
      label: 'Preferred Channels',
      icon: MessageCircle,
      type: 'multiselect',
      description: 'Filter by preferred channels'
    },
    {
      id: 'createdAt',
      label: 'Created Date',
      icon: Calendar,
      type: 'date',
      description: 'Filter by creation date'
    },
    {
      id: 'id',
      label: 'ID',
      icon: Hash,
      type: 'text',
      description: 'Filter by ID'
    }
  ];

  return commonFields;
};

export function FilterPopup({ source, activeFilters, onAddFilter }: FilterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filterFields = getFilterFields(source);
  
  // Filter out already active filters and apply search
  const availableFields = filterFields.filter(field => {
    const isActive = activeFilters.hasOwnProperty(field.id);
    const matchesSearch = field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         field.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return !isActive && matchesSearch;
  });

  const handleFieldClick = (field: FilterField) => {
    onAddFilter(field.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-8 ${activeFilterCount > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
        >
          <Filter className="h-4 w-4 mr-1.5" />
          Filter
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent align="start" className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for a property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {availableFields.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchQuery ? 'No properties found' : 'All available filters are already active'}
            </div>
          ) : (
            <div className="p-2">
              {availableFields.map((field) => {
                const Icon = field.icon;
                return (
                  <button
                    key={field.id}
                    onClick={() => handleFieldClick(field)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="flex-shrink-0">
                      <Icon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {field.label}
                      </div>
                      {field.description && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {field.description}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {field.type}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
