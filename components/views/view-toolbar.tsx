'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ViewSelector } from './view-selector';
import { LayoutSwitcher } from './layout-switcher';
import { Button } from '@/components/ui/button';
import {
    Filter,
    SortAsc,
    Search,
    MoreHorizontal,
    X,
} from 'lucide-react';
import { View, ViewLayout, ViewSource } from '@/lib/api/views';
import { FilterPopup } from './filter-popup';
import { ActiveFiltersBar } from './active-filters-bar';
import { SortCriteria } from './sort-popup';
import { SortDropdown } from './sort-dropdown';

interface ViewToolbarProps {
    views: View[];
    currentView: View;
    onViewChange: (view: View) => void;
    onLayoutChange: (layout: ViewLayout) => void;
    onCreateView: () => void;
    onEditView: (view: View) => void;
    source: ViewSource;
    itemCount?: number;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    filters?: Record<string, any>;
    onFiltersChange?: (filters: Record<string, any>) => void;
    sorts?: SortCriteria[];
    onSortsChange?: (sorts: SortCriteria[]) => void;
    data?: any[];
}

export function ViewToolbar({
    views,
    currentView,
    onViewChange,
    onLayoutChange,
    onCreateView,
    onEditView,
    source,
    itemCount,
    searchValue,
    onSearchChange,
    filters = {},
    onFiltersChange,
    sorts = [],
    onSortsChange,
    data = [],
}: ViewToolbarProps) {

    console.log('filters', filters);
    return (
        <div>
            <div className="flex items-center justify-between py-3 border-b bg-white">
                {/* Left side - View selector and layout switcher */}
                <div className="flex items-center gap-4">
                    <ViewSelector
                        views={views}
                        currentView={currentView}
                        onViewChange={onViewChange}
                        onCreateView={onCreateView}
                        onEditView={onEditView}
                        source={source}
                    />

                    <div className="h-4 w-px bg-gray-300" />

                    <LayoutSwitcher
                        currentLayout={currentView.layout}
                        onLayoutChange={onLayoutChange}
                    />
                </div>

                {/* Right side - Search and actions */}
                <div className="flex items-center gap-2">
                    {/* Animated Search */}
                    {onSearchChange && (
                        <AnimatedSearch
                            searchValue={searchValue}
                            onSearchChange={onSearchChange}
                        />
                    )}

                    {/* Filter popup */}
                    {onFiltersChange && (
                        <FilterPopup
                            source={source}
                            activeFilters={filters}
                            onAddFilter={(filterId) => {
                                const newFilters = { ...filters };
                                // Initialize with empty value based on filter type
                                if (['segments', 'locations', 'education', 'income', 'painPoints', 'channels'].includes(filterId)) {
                                    newFilters[filterId] = [];
                                } else if (filterId === 'ageRange') {
                                    newFilters[filterId] = {};
                                } else {
                                    newFilters[filterId] = '';
                                }
                                onFiltersChange(newFilters);
                            }}
                        />
                    )}

                    {/* Sort dropdown */}
                    {onSortsChange && (
                        <SortDropdown
                            sorts={sorts}
                            onSortsChange={onSortsChange}
                            source={source}
                            availableFields={[
                                { id: 'name', label: 'Name', icon: () => null, field: 'name', type: 'text' },
                                { id: 'segment', label: 'Customer Segment', icon: () => null, field: 'segment.name', type: 'text' },
                                { id: 'location', label: 'Location', icon: () => null, field: 'location', type: 'text' },
                                { id: 'education', label: 'Education', icon: () => null, field: 'education', type: 'text' },
                                { id: 'income', label: 'Income Level', icon: () => null, field: 'incomePerMonth', type: 'number' },
                                { id: 'age', label: 'Age', icon: () => null, field: 'age', type: 'number' },
                            ]}
                            onAddSort={(field: any) => {
                                const newSort: SortCriteria = {
                                    id: `${field.field}-${Date.now()}`,
                                    field: field.field,
                                    label: field.label,
                                    order: 'ASC',
                                    icon: field.icon,
                                };
                                onSortsChange([...sorts, newSort]);
                            }}
                        />
                    )}

                    {/* More options */}
                    <Button variant="outline" size="sm" className="h-8 px-2">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>

                    {/* Item count */}
                    {itemCount !== undefined && (
                        <div className="text-sm text-gray-500 ml-2">
                            {itemCount} {itemCount === 1 ? 'record' : 'records'}
                        </div>
                    )}
                </div>
            </div>

            {/* Active Filters Bar */}
            {onFiltersChange && (
                <ActiveFiltersBar
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    source={source}
                    data={data}
                    sorts={sorts}
                    onSortsChange={onSortsChange}
                />
            )}
        </div>
    );
}

// Animated Search Component
interface AnimatedSearchProps {
    searchValue?: string;
    onSearchChange: (value: string) => void;
}

function AnimatedSearch({ searchValue, onSearchChange }: AnimatedSearchProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleClose = () => {
        setIsExpanded(false);
        onSearchChange('');
    };

    // Focus input when expanded
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                if (!searchValue?.trim()) {
                    setIsExpanded(false);
                }
            }
        };

        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isExpanded, searchValue]);

    return (
        <div className="relative flex items-center">
            {/* Search Icon Button */}
            {!isExpanded && (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={handleToggle}
                >
                    <Search className="h-4 w-4" />
                </Button>
            )}

            {/* Expanded Search Input */}
            {isExpanded && (
                <div className="relative animate-in slide-in-from-right-2 duration-200">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search..."
                        value={searchValue || ''}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all duration-200"
                    />
                    {searchValue && (
                        <button
                            onClick={handleClose}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
