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
  SortAsc,
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
  Type,
} from 'lucide-react';
import { ViewSource } from '@/lib/api/views';

export interface SortCriteria {
  id: string;
  field: string;
  label: string;
  order: 'ASC' | 'DESC';
  icon: React.ComponentType<{ className?: string }>;
}

interface SortField {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  field: string;
  type: 'text' | 'number' | 'date';
  description?: string;
}

interface SortPopupProps {
  source: ViewSource;
  activeSorts: SortCriteria[];
  onAddSort: (field: SortField) => void;
}

// Define available sort fields based on source
const getSortFields = (source: ViewSource): SortField[] => {
  const commonFields: SortField[] = [
    {
      id: 'name',
      label: 'Name',
      icon: Type,
      field: 'name',
      type: 'text',
      description: 'Sort by persona name'
    },
    {
      id: 'segment',
      label: 'Customer Segment',
      icon: Users,
      field: 'segment.name',
      type: 'text',
      description: 'Sort by customer segment'
    },
    {
      id: 'location',
      label: 'Location',
      icon: MapPin,
      field: 'location',
      type: 'text',
      description: 'Sort by location'
    },
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCap,
      field: 'education',
      type: 'text',
      description: 'Sort by education level'
    },
    {
      id: 'income',
      label: 'Income Level',
      icon: DollarSign,
      field: 'incomePerMonth',
      type: 'number',
      description: 'Sort by income level'
    },
    {
      id: 'age',
      label: 'Age',
      icon: User,
      field: 'age',
      type: 'number',
      description: 'Sort by age'
    },
    {
      id: 'createdAt',
      label: 'Created Date',
      icon: Calendar,
      field: 'createdAt',
      type: 'date',
      description: 'Sort by creation date'
    },
    {
      id: 'id',
      label: 'ID',
      icon: Hash,
      field: 'id',
      type: 'text',
      description: 'Sort by ID'
    }
  ];

  return commonFields;
};

export function SortPopup({ source, activeSorts, onAddSort }: SortPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sortFields = getSortFields(source);
  
  // Filter out already active sorts and apply search
  const availableFields = sortFields.filter(field => {
    const isActive = activeSorts.some(sort => sort.field === field.field);
    const matchesSearch = field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         field.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return !isActive && matchesSearch;
  });

  const handleFieldClick = (field: SortField) => {
    onAddSort(field);
    setIsOpen(false);
    setSearchQuery('');
  };

  const activeSortCount = activeSorts.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-8 ${activeSortCount > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
        >
          <SortAsc className="h-4 w-4 mr-1.5" />
          Sort
          {activeSortCount > 0 && (
            <span className="ml-1 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-medium">
              {activeSortCount}
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
              {searchQuery ? 'No properties found' : 'All available sort fields are already active'}
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
