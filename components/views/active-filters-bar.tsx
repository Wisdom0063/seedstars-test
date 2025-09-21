'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    X,
    ChevronDown,
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

interface ActiveFiltersBarProps {
    filters: Record<string, any>;
    onFiltersChange: (filters: Record<string, any>) => void;
    source: ViewSource;
    data?: any[];
}

// Helper functions
function getUniqueOptions(data: any[], path: string, valuePath?: string): Array<{ id: string, label: string, value: any, count: number }> {
    const values = new Map<string, { label: string; value: any; count: number }>();

    data.forEach(item => {
        const value = getNestedValue(item, path);
        const key = getNestedValue(item, valuePath || path);

        if (value && key) {
            const existing = values.get(key);
            if (existing) {
                existing.count++;
            } else {
                values.set(key, { label: value, value: key, count: 1 });
            }
        }
    });

    return Array.from(values.entries()).map(([id, data]) => ({
        id,
        label: data.label,
        value: data.value,
        count: data.count,
    }));
}

function getFlattenedOptions(data: any[], path: string): Array<{ id: string, label: string, value: any, count: number }> {
    const values = new Map<string, number>();

    data.forEach(item => {
        const array = getNestedValue(item, path);
        if (Array.isArray(array)) {
            array.forEach(value => {
                if (value) {
                    values.set(value, (values.get(value) || 0) + 1);
                }
            });
        }
    });

    return Array.from(values.entries()).map(([value, count]) => ({
        id: value,
        label: value,
        value,
        count,
    }));
}

function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Filter field configurations
const getFilterConfig = (filterId: string, source: ViewSource) => {
    const configs: Record<string, any> = {
        segments: {
            label: 'Customer Segment',
            icon: Users,
            type: 'multiselect',
            getOptions: (data: any[]) => getUniqueOptions(data, 'segment.name', 'segment.id')
        },
        locations: {
            label: 'Location',
            icon: MapPin,
            type: 'multiselect',
            getOptions: (data: any[]) => getUniqueOptions(data, 'location')
        },
        education: {
            label: 'Education',
            icon: GraduationCap,
            type: 'multiselect',
            getOptions: (data: any[]) => getUniqueOptions(data, 'education')
        },
        income: {
            label: 'Income Level',
            icon: DollarSign,
            type: 'multiselect',
            getOptions: (data: any[]) => getUniqueOptions(data, 'incomePerMonth')
        },
        ageRange: {
            label: 'Age Range',
            icon: User,
            type: 'range',
            min: 18,
            max: 80
        },
        painPoints: {
            label: 'Pain Points',
            icon: Heart,
            type: 'multiselect',
            getOptions: (data: any[]) => getFlattenedOptions(data, 'painPoints')
        },
        channels: {
            label: 'Preferred Channels',
            icon: MessageCircle,
            type: 'multiselect',
            getOptions: (data: any[]) => getFlattenedOptions(data, 'channels')
        },
        createdAt: {
            label: 'Created Date',
            icon: Calendar,
            type: 'date'
        },
        id: {
            label: 'ID',
            icon: Hash,
            type: 'text'
        }
    };

    return configs[filterId];
};

export function ActiveFiltersBar({ filters, onFiltersChange, source, data = [] }: ActiveFiltersBarProps) {
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
                {activeFilterKeys.map(filterId => {
                    const config = getFilterConfig(filterId, source);
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

            return (
                <div className="w-80 max-h-96 overflow-y-auto">
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
            {/* Header with label and remove button */}
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

            {/* Value display and dropdown trigger */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-900 break-words">
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
