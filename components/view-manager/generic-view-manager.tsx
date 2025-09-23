'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ViewSettingsModal } from './view-settings-modal';
import { LayoutSelectionPopup } from './layout-selection-popup';
import { ViewToolbar } from './view-toolbar';
import { View, ViewLayout, ViewSource, ViewSortCriteria, viewsApi } from '@/lib/api/views';
import { Grid3X3, Kanban, Table } from 'lucide-react';

export interface BaseDataItem {
    id: string;
    [key: string]: any;
}
export interface LayoutComponentProps<T extends BaseDataItem> {
    data: T[];
    onItemClick?: (item: T) => void;
    onItemMove?: (itemId: string, newSegmentId: string) => void;
    onItemReorder?: (reorderedItems: T[]) => void;
    visibleFields?: string[];
}

export type LayoutComponent<T extends BaseDataItem> = React.ComponentType<LayoutComponentProps<T>>;

export interface LayoutConfig<T extends BaseDataItem> {
    [ViewLayout.CARD]: LayoutComponent<T>;
    [ViewLayout.TABLE]: LayoutComponent<T>;
    [ViewLayout.KANBAN]: LayoutComponent<T>;
}

export interface FilterConfig {
    getFilterFields: () => any[];
    getFilterValue: (item: any, field: string) => any;
    applyFilters: (items: any[], filters: Record<string, any>) => any[];
}

export interface SortField {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    field: string;
    type: 'text' | 'number' | 'date';
}

export interface SortConfig {
    getNestedValue: (item: any, field: string) => any;
    getSortableFields: () => SortField[];
}
export interface ViewManagerConfig<T extends BaseDataItem> {
    source: ViewSource;
    layouts: LayoutConfig<T>;
    filterConfig: FilterConfig;
    sortConfig: SortConfig;
    defaultVisibleFields?: string[];
    availableProperties: Array<{ id: string; label: string }>;
}

export interface GenericViewManagerProps<T extends BaseDataItem> {
    data: T[];
    config: ViewManagerConfig<T>;
    onItemClick?: (item: T) => void;
    onItemMove?: (itemId: string, newSegmentId: string) => void;
    renderDetailDrawer?: (item: T | null, isOpen: boolean, onClose: () => void) => React.ReactNode;
}

export interface SortCriteria {
    id: string;
    field: string;
    label: string;
    order: 'ASC' | 'DESC';
    icon: React.ComponentType<{ className?: string }>;
}


export const AllowedLayoutOptions = [
    {
        layout: ViewLayout.CARD,
        icon: Grid3X3,
        label: 'Card',
        description: 'Visual cards with persona details',
        tooltip: 'Card view',

    },
    {
        layout: ViewLayout.TABLE,
        icon: Table,
        label: 'Table',
        description: 'Structured data in columns',
        tooltip: 'Table view',
    },
    {
        layout: ViewLayout.KANBAN,
        icon: Kanban,
        label: 'Kanban',
        description: 'Organize by customer segments',
        tooltip: 'Kanban view',
    },
];




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

    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showViewSettings, setShowViewSettings] = useState(false);
    const [viewToEdit, setViewToEdit] = useState<View | null>(null);

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

    const getNestedValue = (obj: any, path: string): any => {
        return config.sortConfig.getNestedValue(obj, path);
    };
    const filteredData = useMemo(() => {
        let result = [...data];

        if (searchValue.trim()) {
            result = result.filter(item =>
                JSON.stringify(item).toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        result = config.filterConfig.applyFilters(result, filters);

        if (sorts.length > 0) {
            result.sort((a, b) => {
                for (const sort of sorts) {
                    if (!sort || !sort.field) {
                        continue;
                    }

                    let aValue = getNestedValue(a, sort.field);
                    let bValue = getNestedValue(b, sort.field);

                    if (aValue == null && bValue == null) continue;
                    if (aValue == null) return sort.order === 'ASC' ? 1 : -1;
                    if (bValue == null) return sort.order === 'ASC' ? -1 : 1;
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

        if (currentView && view.id === currentView.id && view.updatedAt !== currentView.updatedAt) {
            setViews(prev => prev.map(v => v.id === view.id ? view : v));
        }

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
            const newView = await viewsApi.create({
                name: 'Untitled View',
                source: config.source,
                layout,
            });

            setViews(prev => [...prev, newView]);
            setCurrentView(newView);

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
        setViews(prev => prev.map(v => v.id === updatedView.id ? updatedView : v));

        if (currentView?.id === updatedView.id) {
            setCurrentView(updatedView);
        }
    };

    const handleItemClick = (item: T) => {
        onItemClick?.(item);
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

            {showLayoutSelection && (
                <LayoutSelectionPopup
                    onClose={() => setShowLayoutSelection(false)}
                    onLayoutSelect={handleLayoutSelect}
                    layouts={config.layouts}
                />
            )}

            {showViewSettings && viewToEdit && (
                <ViewSettingsModal
                    view={viewToEdit}
                    onClose={handleViewSettingsClose}
                    onLayoutChange={handleLayoutChange}
                    onEditView={handleEditView}
                    onViewUpdate={handleViewUpdate}
                    availableProperties={config.availableProperties}
                />
            )}

            {renderDetailDrawer && renderDetailDrawer(selectedItem, isDrawerOpen, handleDrawerClose)}
        </div>
    );
}
