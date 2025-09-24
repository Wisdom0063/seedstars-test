'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ViewSelector } from './view-selector';
import { ViewSettingsPopover } from './view-settings-popover';
import { Button } from '@/components/ui/button';
import {
    Search,
    MoreHorizontal,
    X,
} from 'lucide-react';
import { View, ViewLayout, ViewSource, ViewSortCriteria } from '@/lib/api/views';
import { FilterPopup } from './filter-popup';
import { ActiveFiltersBar } from './active-filters-bar';
import { SortDropdown } from './sort-dropdown';
import { FilterConfig, SortConfig } from './generic-view-manager';

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
    sorts?: ViewSortCriteria[];
    onSortsChange?: (sorts: ViewSortCriteria[]) => void;
    data?: any[];
    filterConfig?: FilterConfig;
    sortConfig?: SortConfig;
    availableProperties: Array<{ id: string; label: string }>;
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
    filterConfig,
    sortConfig,
    availableProperties,
}: ViewToolbarProps) {

    return (
        <div>
            <div className="flex items-center py-3 border-b bg-white min-h-[60px]">
                <div className="flex-1 min-w-0 mr-4">
                    <div className="overflow-x-auto overflow-y-hidden" style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}>
                        <ViewSelector
                            views={views}
                            currentView={currentView}
                            onViewChange={onViewChange}
                            onCreateView={onCreateView}
                            onEditView={onEditView}
                            onLayoutChange={onLayoutChange}
                            source={source}
                            availableProperties={availableProperties}
                        />
                    </div>
                </div>

                {/* Right side - Fixed Controls */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {onSearchChange && (
                        <AnimatedSearch
                            searchValue={searchValue}
                            onSearchChange={onSearchChange}
                        />
                    )}

                    {onFiltersChange && (
                        <FilterPopup
                            source={source}
                            activeFilters={filters}
                            getFilterFields={filterConfig?.getFilterFields}
                            onAddFilter={(filterId) => {
                                const newFilters = { ...filters };
                                if (['segments', 'locations', 'education', 'income', 'painPoints', 'channels', 'gender'].includes(filterId)) {
                                    newFilters[filterId] = [];
                                } else if (['age', 'ageRange'].includes(filterId)) {
                                    newFilters[filterId] = {};
                                } else {
                                    newFilters[filterId] = '';
                                }
                                onFiltersChange(newFilters);
                            }}
                        />
                    )}

                    {onSortsChange && (
                        <SortDropdown
                            sorts={sorts}
                            onSortsChange={onSortsChange}
                            source={source}
                            availableFields={sortConfig?.getSortableFields() || []}
                            onAddSort={(field: any) => {
                                const newSort: ViewSortCriteria = {
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

                    <ViewSettingsPopover
                        view={currentView}
                        onLayoutChange={onLayoutChange}
                        onViewUpdate={(updatedView) => {
                            onViewChange(updatedView);
                        }}
                        availableProperties={availableProperties}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </ViewSettingsPopover>

                    {itemCount !== undefined && (
                        <div className="text-sm text-gray-500 ml-1 sm:ml-2 whitespace-nowrap hidden sm:block">
                            {itemCount} {itemCount === 1 ? 'record' : 'records'}
                        </div>
                    )}
                </div>
            </div>

            {onFiltersChange && (
                <ActiveFiltersBar
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    source={source}
                    data={data}
                    sorts={sorts}
                    onSortsChange={onSortsChange}
                    filterConfig={filterConfig}
                    sortConfig={sortConfig}
                />
            )}

        </div>
    );
}

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

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

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

            {isExpanded && (
                <div className="relative animate-in slide-in-from-right-2 duration-200">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search..."
                        value={searchValue || ''}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 sm:w-64 transition-all duration-200"
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
