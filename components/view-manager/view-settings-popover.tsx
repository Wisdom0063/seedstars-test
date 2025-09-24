'use client';

import React, { useState } from 'react';
import {
    Settings,
    Star,
    Eye,
    EyeOff,
    Edit3,
    Check,
    Grid3X3,
    List,
    Kanban,
    ChevronRight
} from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { View, ViewLayout, viewsApi } from '@/lib/api/views';

interface ViewSettingsPopoverProps {
    view: View;
    onLayoutChange: (layout: ViewLayout) => void;
    onViewUpdate?: (view: View) => void;
    availableProperties?: { id: string; label: string }[];
    children: React.ReactNode;
}

const LayoutIcons = {
    [ViewLayout.CARD]: Grid3X3,
    [ViewLayout.TABLE]: List,
    [ViewLayout.KANBAN]: Kanban,
};

export function ViewSettingsPopover({
    view,
    onLayoutChange,
    onViewUpdate,
    availableProperties = [],
    children
}: ViewSettingsPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLayout, setSelectedLayout] = useState(view.layout);
    const [viewName, setViewName] = useState(view.name);
    const [isEditingName, setIsEditingName] = useState(false);
    const [visibleFields, setVisibleFields] = useState<string[]>(
        view.visibleFields || []
    );
    const [showPropertyVisibility, setShowPropertyVisibility] = useState(false);

    const handleLayoutChange = async (layout: ViewLayout) => {
        setSelectedLayout(layout);
        onLayoutChange(layout);

        try {
            const updatedView = await viewsApi.update({
                id: view.id,
                layout,
            });
            onViewUpdate?.(updatedView);
        } catch (error) {
            console.error('Failed to update view layout:', error);
            setSelectedLayout(view.layout);
        }
    };

    const handleNameSave = async () => {
        if (viewName === view.name) {
            setIsEditingName(false);
            return;
        }

        setIsEditingName(false);

        try {
            const updatedView = await viewsApi.update({
                id: view.id,
                name: viewName,
            });
            onViewUpdate?.(updatedView);
        } catch (error) {
            console.error('Failed to update view name:', error);
            setViewName(view.name);
        }
    };

    const togglePropertyVisibility = async (propertyId: string) => {
        const newVisibleFields = visibleFields.includes(propertyId)
            ? visibleFields.filter(id => id !== propertyId)
            : [...visibleFields, propertyId];

        setVisibleFields(newVisibleFields);

        try {
            const updatedView = await viewsApi.update({
                id: view.id,
                visibleFields: newVisibleFields,
            });
            onViewUpdate?.(updatedView);
        } catch (error) {
            console.error('Failed to update view visible fields:', error);
            setVisibleFields(view.visibleFields || []);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="w-96 p-0"
                sideOffset={5}
            >
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">View Settings</h3>
                </div>

                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <Star className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={viewName}
                                    onChange={(e) => setViewName(e.target.value)}
                                    onBlur={handleNameSave}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleNameSave();
                                        if (e.key === 'Escape') {
                                            setViewName(view.name);
                                            setIsEditingName(false);
                                        }
                                    }}
                                    className="font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 w-full"
                                    autoFocus
                                />
                            ) : (
                                <div
                                    className="font-medium text-gray-900 cursor-pointer"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    {viewName}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsEditingName(true)}
                            className="p-1 hover:bg-gray-200 rounded"
                        >
                            <Edit3 className="h-4 w-4 text-gray-400" />
                        </button>
                    </div>

                    <div>
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Grid3X3 className="h-5 w-5 text-gray-400" />
                                <span className="font-medium text-gray-900">Layout</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <span className="capitalize">{selectedLayout.toLowerCase()}</span>
                            </div>
                        </div>

                        <div className="pl-8 mt-2">
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(LayoutIcons).map(([layout, Icon]) => (
                                    <button
                                        key={layout}
                                        onClick={() => handleLayoutChange(layout as ViewLayout)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${selectedLayout === layout
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="h-6 w-6 text-gray-600" />
                                        <span className="text-sm font-medium capitalize">
                                            {layout.toLowerCase()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Property Visibility */}
                    {availableProperties.length > 0 && (
                        <div>
                            <div
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => setShowPropertyVisibility(!showPropertyVisibility)}
                            >
                                <div className="flex items-center gap-3">
                                    <Eye className="h-5 w-5 text-gray-400" />
                                    <span className="font-medium text-gray-900">Property visibility</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <span>{visibleFields.length}</span>
                                    <ChevronRight className={`h-4 w-4 transition-transform ${showPropertyVisibility ? 'rotate-90' : ''}`} />
                                </div>
                            </div>

                            {showPropertyVisibility && (
                                <div className="pl-8 space-y-2 mt-2">
                                    {availableProperties.map((property) => {
                                        const isVisible = visibleFields.includes(property.id);
                                        return (
                                            <div
                                                key={property.id}
                                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                                onClick={() => togglePropertyVisibility(property.id)}
                                            >
                                                <span className="text-sm text-gray-700">{property.label}</span>
                                                <button
                                                    className={`p-1 rounded transition-colors ${isVisible
                                                            ? 'text-blue-600 hover:bg-blue-50'
                                                            : 'text-gray-400 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {isVisible ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
