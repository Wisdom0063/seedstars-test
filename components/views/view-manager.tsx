'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ViewToolbar } from './view-toolbar';
import PersonaCards from '../views/customer-segment/card';
import { PersonaTable } from '../views/customer-segment/table';
import { PersonaKanban } from '../views/customer-segment/kanban';
import { View, ViewLayout, ViewSource, ViewSortCriteria, viewsApi } from '@/lib/api/views';
import { Persona } from '@/lib/api/customer-segment';

interface ViewManagerProps {
    personas: Persona[];
    source: ViewSource;
    onPersonaClick?: (persona: Persona) => void;
    onPersonaMove?: (personaId: string, newSegmentId: string) => void;
}

export function ViewManager({
    personas,
    source,
    onPersonaClick,
    onPersonaMove,
}: ViewManagerProps) {
    const [views, setViews] = useState<View[]>([]);
    const [currentView, setCurrentView] = useState<View | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sorts, setSorts] = useState<ViewSortCriteria[]>([]);

    // Load views on mount
    useEffect(() => {
        loadViews();
    }, [source]);

    // Debug: Log when filters or sorts change
    useEffect(() => {
        console.log('Filters changed:', filters);
    }, [filters]);

    useEffect(() => {
        console.log('Sorts changed:', sorts);
    }, [sorts]);

    const loadViews = async () => {
        try {
            setLoading(true);
            const allViews = await viewsApi.getBySource(source);
            setViews(allViews);

            // Set current view to default or first view
            const defaultView = allViews.find(view => view.isDefault) || allViews[0];
            if (defaultView) {
                setCurrentView(defaultView);
                // Load active filters and sorts from the view
                setFilters(defaultView.activeFilters || {});
                setSorts(defaultView.activeSorts || []);
            }
        } catch (error) {
            console.error('Failed to load views:', error);
            // const fallbackView: View = {
            //     id: 'fallback',
            //     name: 'All Items',
            //     isDefault: true,
            //     source,
            //     layout: ViewLayout.CARD,
            //     sortBy: 'name',
            //     sortOrder: 'ASC' as any,
            //     createdAt: new Date(),
            //     updatedAt: new Date(),
            // };
            // setViews([fallbackView]);
            // setCurrentView(fallbackView);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get nested object values
    const getNestedValue = (obj: any, path: string): any => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    // Filter, search, and sort personas
    const filteredPersonas = useMemo(() => {
        let result = [...personas];

        // Apply search filter
        if (searchValue.trim()) {
            const searchLower = searchValue.toLowerCase();
            result = result.filter(persona =>
                persona.name.toLowerCase().includes(searchLower) ||
                persona.location?.toLowerCase().includes(searchLower) ||
                persona.education?.toLowerCase().includes(searchLower) ||
                persona.segment.name.toLowerCase().includes(searchLower) ||
                persona.painPoints?.some(point => point.toLowerCase().includes(searchLower)) ||
                persona.channels?.some(channel => channel.toLowerCase().includes(searchLower))
            );
        }

        // Apply filters
        if (filters.segments?.length) {
            result = result.filter(persona => filters.segments.includes(persona.segment.id));
        }
        if (filters.locations?.length) {
            result = result.filter(persona => persona.location && filters.locations.includes(persona.location));
        }
        if (filters.education?.length) {
            result = result.filter(persona => persona.education && filters.education.includes(persona.education));
        }
        if (filters.income?.length) {
            result = result.filter(persona => persona.incomePerMonth && filters.income.includes(persona.incomePerMonth));
        }
        if (filters.ageRange?.min !== undefined || filters.ageRange?.max !== undefined) {
            result = result.filter(persona => {
                if (!persona.age) return false;
                const min = filters.ageRange?.min ?? 0;
                const max = filters.ageRange?.max ?? 999;
                return persona.age >= min && persona.age <= max;
            });
        }
        if (filters.painPoints?.length) {
            result = result.filter(persona =>
                persona.painPoints?.some(point => filters.painPoints.includes(point))
            );
        }
        if (filters.channels?.length) {
            result = result.filter(persona =>
                persona.channels?.some(channel => filters.channels.includes(channel))
            );
        }
        if (filters.id) {
            result = result.filter(persona =>
                persona.id.toLowerCase().includes(filters.id.toLowerCase())
            );
        }

        // Apply sorting (multiple criteria)
        if (sorts.length > 0) {
            result.sort((a, b) => {
                for (const sort of sorts) {
                    let aValue = getNestedValue(a, sort.field);
                    let bValue = getNestedValue(b, sort.field);

                    // Handle null/undefined values
                    if (aValue == null && bValue == null) continue;
                    if (aValue == null) return sort.order === 'ASC' ? 1 : -1;
                    if (bValue == null) return sort.order === 'ASC' ? -1 : 1;

                    // Handle different data types
                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        aValue = aValue.toLowerCase();
                        bValue = bValue.toLowerCase();
                    }

                    if (aValue < bValue) return sort.order === 'ASC' ? -1 : 1;
                    if (aValue > bValue) return sort.order === 'ASC' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [personas, searchValue, filters, sorts]);

    const handleViewChange = (view: View) => {
        console.log('=== VIEW CHANGE ===');
        console.log('Switching from:', currentView?.name, 'to:', view.name);
        console.log('Previous filters:', filters);
        console.log('Previous sorts:', sorts);
        console.log('New view activeFilters:', view.activeFilters);
        console.log('New view activeSorts:', view.activeSorts);
        
        setCurrentView(view);
        
        // Load active filters and sorts from the selected view
        // Explicitly handle null values to ensure proper clearing
        const newFilters = view.activeFilters ? { ...view.activeFilters } : {};
        const newSorts = view.activeSorts ? [...view.activeSorts] : [];
        
        console.log('Setting filters to:', newFilters);
        console.log('Setting sorts to:', newSorts);
        console.log('===================');
        
        setFilters(newFilters);
        setSorts(newSorts);
    };

    const handleLayoutChange = async (layout: ViewLayout) => {
        if (!currentView) return;

        setCurrentView(prev => prev ? { ...prev, layout } : null);


        // try {
        //   const updatedView = await viewsApi.update({
        //     id: currentView.id,
        //     layout,
        //   });
        //   setCurrentView(updatedView);

        //   // Update views list
        //   setViews(prev => prev.map(view => 
        //     view.id === updatedView.id ? updatedView : view
        //   ));
        // } catch (error) {
        //   console.error('Failed to update view layout:', error);
        //   // Optimistic update for better UX
        //   setCurrentView(prev => prev ? { ...prev, layout } : null);
        // }
    };

    const handleCreateView = () => {
        // TODO: Implement create view modal
        console.log('Create new view');
    };

    const handleEditView = (view: View) => {
        // TODO: Implement edit view modal
        console.log('Edit view:', view);
    };

    const handleFiltersChange = async (newFilters: Record<string, any>) => {
        if (!currentView) return;
        if (newFilters === currentView.activeFilters) return;

        setFilters(newFilters);

        alert("filters changed")

        // Persist active filters to the current view
        try {

            console.log("currentView", newFilters)
            const updatedView = await viewsApi.update({
                id: currentView.id,
                activeFilters: newFilters,
            });

            // Update the view in the views list
            setViews(prev => prev.map(view =>
                view.id === updatedView.id ? updatedView : view
            ));
            setCurrentView(updatedView);
        } catch (error) {
            console.error('Failed to update view active filters:', error);
            // Revert on error
            // setFilters(currentView.activeFilters || {});
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

            // Update the view in the views list
            setViews(prev => prev.map(view =>
                view.id === updatedView.id ? updatedView : view
            ));
            setCurrentView(updatedView);
        } catch (error) {
            console.error('Failed to update view active sorts:', error);
            // Revert on error
            setSorts(currentView.activeSorts || []);
        }
    };

    const renderContent = () => {
        if (!currentView) return null;

        const commonProps = {
            personas: filteredPersonas,
            onPersonaClick,
        };

        switch (currentView.layout) {
            case ViewLayout.CARD:
                return <PersonaCards {...commonProps} />;

            case ViewLayout.TABLE:
                return <PersonaTable {...commonProps} />;

            case ViewLayout.KANBAN:
                return (
                    <PersonaKanban
                        {...commonProps}
                        onPersonaMove={onPersonaMove}
                    />
                );

            default:
                return <PersonaCards {...commonProps} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading views...</div>
            </div>
        );
    }

    if (!currentView) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">No views available</div>
            </div>
        );
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
                source={source}
                itemCount={filteredPersonas.length}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                sorts={sorts}
                onSortsChange={handleSortsChange}
                data={personas}
            />

            <div className="min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
}
