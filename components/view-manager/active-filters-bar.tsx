'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    X,
    ChevronDown,

} from 'lucide-react';
import { ViewSource } from '@/lib/api/views';
import { SortDropdown } from './sort-dropdown';
import { ViewSortCriteria } from '@/lib/api/views';
import { FilterConfig, SortConfig } from './generic-view-manager';
import { VirtualizedMultiSelect } from '../ui/shadcn-io/virtualized-multi-select';

interface ActiveFiltersBarProps {
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    source: ViewSource;
    data?: any[];
    sorts?: ViewSortCriteria[];
    onSortsChange?: (sorts: ViewSortCriteria[]) => void;
    filterConfig?: FilterConfig;
    sortConfig?: SortConfig;
}



export function ActiveFiltersBar({ filters, onFiltersChange, source, data = [], sorts, onSortsChange, filterConfig, sortConfig }: ActiveFiltersBarProps) {
    const activeFilterKeys = Object.keys(filters).filter(key => {
        const value = filters[key];
        // Show filter if it exists in the filters object, regardless of whether it has values
        // This allows users to see and configure newly added filters
        return value !== undefined;
    });

    const removeFilter = (filterId: string) => {
        const newFilters = { ...filters };
        delete newFilters[filterId];
        onFiltersChange(newFilters);
    };

    const updateFilter = (filterId: string, value: any) => {
        const newFilters = { ...filters };
        newFilters[filterId] = value;
        onFiltersChange(newFilters);
    };

    if (activeFilterKeys.length === 0) {
        console.log('no active filters');
        return null;
    }

    console.log('activeFilterKeys', activeFilterKeys);

    return (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">

                {onSortsChange && sorts && sorts.length > 0 && sortConfig && (
                    <SortDropdown
                        sorts={sorts}
                        onSortsChange={onSortsChange}
                        source={source}
                        availableFields={sortConfig.getSortableFields()}
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
                {activeFilterKeys.map(filterId => {
                    const config = filterConfig?.getFilterFields()?.find((field) => field.id === filterId);
                    if (!config) return null;

                    return (
                        <FilterChip
                            key={filterId}
                            filterId={filterId}
                            config={config}
                            value={filters[filterId]}
                            data={data}
                            onUpdate={(value) => updateFilter(filterId, value)}
                            onRemove={() => removeFilter(filterId)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

interface FilterChipProps {
    filterId: string;
    config: any;
    value: any;
    data: any[];
    onUpdate: (value: any) => void;
    onRemove: () => void;
}

function FilterChip({ filterId, config, value, data, onUpdate, onRemove }: FilterChipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = config.icon;

    const getDisplayText = () => {
        if (config.type === 'multiselect' && Array.isArray(value)) {
            if (value.length === 0) return 'Select...';

            // Get display labels for the selected values
            const options = config.getOptions ? config.getOptions(data) : [];
            const selectedLabels = value.map(selectedValue => {
                const option = options.find((opt: any) => opt.value === selectedValue);
                return option ? option.label : selectedValue;
            });

            if (selectedLabels.length === 1) return selectedLabels[0];
            return selectedLabels.join(', ');
        }
        if (config.type === 'range') {
            if (!value || (value.min === undefined && value.max === undefined)) {
                return 'Select range...';
            }
            const { min, max } = value;
            if (min !== undefined && max !== undefined) return `${min} - ${max}`;
            if (min !== undefined) return `≥ ${min}`;
            if (max !== undefined) return `≤ ${max}`;
            return 'Select range...';
        }
        if (config.type === 'text') {
            if (!value || value.trim() === '') return 'Enter text...';
            return value;
        }
        return 'Select...';
    };

    const renderFilterContent = () => {
        if (config.type === 'multiselect') {
            const options = config.getOptions ? config.getOptions(data) : [];

            if (options.length > 100) {
                return (
                    <VirtualizedMultiSelect
                        options={options}
                        value={Array.isArray(value) ? value : []}
                        onUpdate={onUpdate}
                        label={config.label}
                        searchPlaceholder={`Search ${config.label.toLowerCase()}...`}
                    />
                );
            }

            return (
                <div className="w-full max-h-96 overflow-y-auto">
                    <div className="p-4">
                        <div className="text-sm font-medium text-gray-700 mb-3">
                            Select values for {config.label}
                        </div>
                        <div className="space-y-2">
                            {options.map((option: any) => {
                                const isSelected = Array.isArray(value) && value.includes(option.value);
                                return (
                                    <label
                                        key={option.id}
                                        className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => {
                                                const newValue = Array.isArray(value) ? [...value] : [];
                                                if (e.target.checked) {
                                                    newValue.push(option.value);
                                                } else {
                                                    const index = newValue.indexOf(option.value);
                                                    if (index > -1) newValue.splice(index, 1);
                                                }
                                                onUpdate(newValue);
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="flex-1">{option.label}</span>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {option.count}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        if (config.type === 'range') {
            return (
                <div className="w-72 p-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                        Set range for {config.label}
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                            <Input
                                type="number"
                                placeholder="Min"
                                value={value?.min || ''}
                                onChange={(e) => onUpdate({
                                    ...value,
                                    min: e.target.value ? parseInt(e.target.value) : undefined
                                })}
                                min={config.min}
                                max={config.max}
                                className="w-full"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                            <Input
                                type="number"
                                placeholder="Max"
                                value={value?.max || ''}
                                onChange={(e) => onUpdate({
                                    ...value,
                                    max: e.target.value ? parseInt(e.target.value) : undefined
                                })}
                                min={config.min}
                                max={config.max}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (config.type === 'text') {
            return (
                <div className="w-72 p-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                        Filter {config.label}
                    </div>
                    <Input
                        type="text"
                        placeholder={`Enter ${config.label.toLowerCase()}...`}
                        value={value || ''}
                        onChange={(e) => onUpdate(e.target.value)}
                        className="w-full"
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <div className="w-48 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">{config.label}</span>
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
                    <button className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors max-h-20 overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-900 break-words leading-relaxed">
                                    {getDisplayText()}
                                </div>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                        </div>
                    </button>
                </PopoverTrigger>

                <PopoverContent align="start" className="p-0">
                    {renderFilterContent()}
                </PopoverContent>
            </Popover>
        </div>
    );
}
