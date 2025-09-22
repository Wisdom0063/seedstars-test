'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ViewSettingsModal } from './view-settings-modal';
import { LayoutSelectionPopup } from './layout-selection-popup';
import { ViewToolbar } from './view-toolbar';
import { View, ViewLayout, ViewSource, ViewSortCriteria, viewsApi } from '@/lib/api/views';

// Generic interfaces for data items
export interface BaseDataItem {
    id: string;
    [key: string]: any;
}

// Layout component props interface
export interface LayoutComponentProps<T extends BaseDataItem> {
    data: T[];
    onItemClick?: (item: T) => void;
    onItemMove?: (itemId: string, newSegmentId: string) => void;
    onItemReorder?: (reorderedItems: T[]) => void;
    visibleFields?: string[];
}

// Layout component type
export type LayoutComponent<T extends BaseDataItem> = React.ComponentType<LayoutComponentProps<T>>;

// Layout configuration
export interface LayoutConfig<T extends BaseDataItem> {
    [ViewLayout.CARD]: LayoutComponent<T>;
    [ViewLayout.TABLE]: LayoutComponent<T>;
    [ViewLayout.KANBAN]: LayoutComponent<T>;
}

// Filter configuration
export interface FilterConfig {
    getFilterFields: (source: ViewSource) => any[];
    getFilterValue: (item: any, field: string) => any;
    applyFilters: (items: any[], filters: Record<string, any>) => any[];
}

// Sort field interface
export interface SortField {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    field: string;
    type: 'text' | 'number' | 'date';
}

// Sort configuration
export interface SortConfig {
    getNestedValue: (item: any, field: string) => any;
    getSortableFields: () => SortField[];
}

// View manager configuration
export interface ViewManagerConfig<T extends BaseDataItem> {
    source: ViewSource;
    layouts: LayoutConfig<T>;
    filterConfig: FilterConfig;
    sortConfig: SortConfig;
    defaultVisibleFields?: string[];
    availableProperties: Array<{ id: string; label: string }>;
}

// Generic ViewManager props
export interface GenericViewManagerProps<T extends BaseDataItem> {
    data: T[];
    config: ViewManagerConfig<T>;
    onItemClick?: (item: T) => void;
    onItemMove?: (itemId: string, newSegmentId: string) => void;
    renderDetailDrawer?: (item: T | null, isOpen: boolean, onClose: () => void) => React.ReactNode;
}

export function GenericViewManager<T extends BaseDataItem>({
    data,
    config,
    onItemClick,
    onItemMove,
    renderDetailDrawer,
}: GenericViewManagerProps<T>) {
    const [views, setViews] = useState<View[]>([]);
    const [currentView, setCurrentView] = useState<View | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sorts, setSorts] = useState<ViewSortCriteria[]>([]);
    const [showLayoutSelection, setShowLayoutSelection] = useState(false);
    const [loading, setLoading] = useState(false);

    // Drawer state management
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showViewSettings, setShowViewSettings] = useState(false);
    const [viewToEdit, setViewToEdit] = useState<View | null>(null);

    // Load views on mount
    useEffect(() => {
        loadViews();
    }, [config.source]);

    const loadViews = async () => {
        try {
            setLoading(true);
            const allViews = await viewsApi.getBySource(config.source);
            setViews(allViews);

            // Set current view to default or first view
            const defaultView = allViews.find(view => view.isDefault) || allViews[0];
            if (defaultView) {
                handleViewChange(defaultView);
            }
        } catch (error) {
            console.error('Failed to load views:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get nested values for sorting
    const getNestedValue = (obj: any, path: string): any => {
        return config.sortConfig.getNestedValue(obj, path);
    };

    // Filter and sort data
    const filteredData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchValue.trim()) {
            result = result.filter(item =>
                JSON.stringify(item).toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        // Apply filters using config
        result = config.filterConfig.applyFilters(result, filters);

        // Apply sorting (multiple criteria)
        if (sorts.length > 0) {
            result.sort((a, b) => {
                for (const sort of sorts) {
                    // Skip sorts with invalid fields
                    if (!sort || !sort.field) {
                        continue;
                    }

                    let aValue = getNestedValue(a, sort.field);
                    let bValue = getNestedValue(b, sort.field);

                    // Handle null/undefined values
                    if (aValue == null && bValue == null) continue;
                    if (aValue == null) return sort.order === 'ASC' ? 1 : -1;
                    if (bValue == null) return sort.order === 'ASC' ? -1 : 1;

                    // Convert to strings for comparison if needed
                    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                    if (aValue < bValue) return sort.order === 'ASC' ? -1 : 1;
                    if (aValue > bValue) return sort.order === 'ASC' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [data, searchValue, filters, sorts, config]);

    const handleViewChange = (view: View) => {
        setCurrentView(view);

        // Update views list if this is an updated view (not just a switch)
        if (currentView && view.id === currentView.id && view.updatedAt !== currentView.updatedAt) {
            setViews(prev => prev.map(v => v.id === view.id ? view : v));
        }

        // Load active filters and sorts from the selected view
        const newFilters = view.activeFilters ? { ...view.activeFilters } : {};
        const newSorts = view.activeSorts
            ? view.activeSorts.filter(sort => sort && sort.field && typeof sort.field === 'string')
            : [];

        setFilters(newFilters);
        setSorts(newSorts);
    };

    const handleLayoutChange = async (layout: ViewLayout) => {
        if (!currentView) return;

        setCurrentView(prev => prev ? { ...prev, layout } : null);
    };

    const handleCreateView = () => {
        setShowLayoutSelection(true);
    };

    const handleLayoutSelect = async (layout: ViewLayout) => {
        try {
            // Create view with just layout and source
            const newView = await viewsApi.create({
                name: 'Untitled View',
                source: config.source,
                layout,
            });

            // Add to views list and set as current
            setViews(prev => [...prev, newView]);
            setCurrentView(newView);

            // Close layout selection and open view settings
            setShowLayoutSelection(false);
            setViewToEdit(newView);
            setShowViewSettings(true);
        } catch (error) {
            console.error('Failed to create view:', error);
        }
    };

    const handleEditView = (view: View) => {
        setViewToEdit(view);
        setShowViewSettings(true);
    };

    const handleViewSettingsClose = () => {
        setShowViewSettings(false);
        setViewToEdit(null);
    };

    const handleViewUpdate = (updatedView: View) => {
        // Update views list
        setViews(prev => prev.map(v => v.id === updatedView.id ? updatedView : v));

        // Update current view if it's the one being edited
        if (currentView?.id === updatedView.id) {
            setCurrentView(updatedView);
        }
    };

    // Smart item click handler - manages both external callbacks and drawer state
    const handleItemClick = (item: T) => {
        // Always call external callback if provided (for backward compatibility)
        onItemClick?.(item);

        // If drawer renderer is provided, manage drawer state
        if (renderDetailDrawer) {
            setSelectedItem(item);
            setIsDrawerOpen(true);
        }
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setSelectedItem(null);
    };

    const handleFiltersChange = async (newFilters: Record<string, any>) => {
        if (!currentView) return;
        if (newFilters === currentView.activeFilters) return;

        setFilters(newFilters);

        // Persist active filters to the current view
        try {
            const updatedView = await viewsApi.update({
                id: currentView.id,
                activeFilters: newFilters,
            });
            setCurrentView(updatedView);
            setViews(prev => prev.map(v => v.id === updatedView.id ? updatedView : v));
        } catch (error) {
            console.error('Failed to update view filters:', error);
        }
    };

    const handleSortsChange = async (newSorts: ViewSortCriteria[]) => {
        if (!currentView) return;

        setSorts(newSorts);

        // Persist active sorts to the current view
        try {
            const updatedView = await viewsApi.update({
                id: currentView.id,
                activeSorts: newSorts,
            });
            setCurrentView(updatedView);
            setViews(prev => prev.map(v => v.id === updatedView.id ? updatedView : v));
        } catch (error) {
            console.error('Failed to update view sorts:', error);
        }
    };

    const renderContent = () => {
        if (!currentView) return null;

        const commonProps: LayoutComponentProps<T> = {
            data: filteredData,
            onItemClick: handleItemClick, // Use smart click handler
            visibleFields: currentView.visibleFields || config.defaultVisibleFields || [],
            onItemReorder: (reorderedItems: T[]) => {
                console.log('Items reordered:', reorderedItems.map(item => item.id));
                // TODO: Optionally persist the order to the view or handle reordering logic
            },
        };

        // Add onItemMove for kanban layout
        if (currentView.layout === ViewLayout.KANBAN) {
            (commonProps as any).onItemMove = onItemMove;
        }

        const LayoutComponent = config.layouts[currentView.layout];
        return <LayoutComponent {...commonProps} />;
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading views...</div>;
    }

    if (!currentView) {
        return <div className="flex justify-center p-8">No views available</div>;
    }

    return (
        <div className="space-y-4">
            <ViewToolbar
                views={views}
                currentView={currentView}
                onViewChange={handleViewChange}
                onLayoutChange={handleLayoutChange}
                onCreateView={handleCreateView}
                onEditView={handleEditView}
                source={config.source}
                itemCount={filteredData.length}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                sorts={sorts}
                onSortsChange={handleSortsChange}
                data={data}
                filterConfig={config.filterConfig}
                availableProperties={config.availableProperties}
            />

            <div className="min-h-[400px]">
                {renderContent()}
            </div>

            {/* Layout Selection Popup */}
            {showLayoutSelection && (
                <LayoutSelectionPopup
                    onClose={() => setShowLayoutSelection(false)}
                    onLayoutSelect={handleLayoutSelect}
                />
            )}

            {/* View Settings Modal */}
            {showViewSettings && viewToEdit && (
                <ViewSettingsModal
                    view={viewToEdit}
                    onClose={handleViewSettingsClose}
                    onLayoutChange={handleLayoutChange}
                    onEditView={handleEditView}
                    onViewUpdate={handleViewUpdate}
                />
            )}

            {/* Detail Drawer - Rendered by data source specific component */}
            {renderDetailDrawer && renderDetailDrawer(selectedItem, isDrawerOpen, handleDrawerClose)}
        </div>
    );
}
