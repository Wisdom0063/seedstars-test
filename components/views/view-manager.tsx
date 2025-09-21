'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ViewToolbar } from './view-toolbar';
import PersonaCards from '../views/customer-segment/card';
import { PersonaTable } from '../views/customer-segment/table';
import { PersonaKanban } from '../views/customer-segment/kanban';
import { View, ViewLayout, ViewSource, viewsApi } from '@/lib/api/views';
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

    // Load views on mount
    useEffect(() => {
        loadViews();
    }, [source]);

    const loadViews = async () => {
        try {
            setLoading(true);
            const allViews = await viewsApi.getBySource(source);
            setViews(allViews);

            // Set current view to default or first view
            const defaultView = allViews.find(view => view.isDefault) || allViews[0];
            if (defaultView) {
                setCurrentView(defaultView);
            }
        } catch (error) {
            console.error('Failed to load views:', error);
            const fallbackView: View = {
                id: 'fallback',
                name: 'All Items',
                isDefault: true,
                source,
                layout: ViewLayout.CARD,
                sortBy: 'name',
                sortOrder: 'ASC' as any,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setViews([fallbackView]);
            setCurrentView(fallbackView);
        } finally {
            setLoading(false);
        }
    };

    // Filter personas based on search
    const filteredPersonas = useMemo(() => {
        if (!searchValue.trim()) return personas;

        const searchLower = searchValue.toLowerCase();
        return personas.filter(persona =>
            persona.name.toLowerCase().includes(searchLower) ||
            persona.location?.toLowerCase().includes(searchLower) ||
            persona.education?.toLowerCase().includes(searchLower) ||
            persona.segment.name.toLowerCase().includes(searchLower) ||
            persona.painPoints?.some(point => point.toLowerCase().includes(searchLower)) ||
            persona.channels?.some(channel => channel.toLowerCase().includes(searchLower))
        );
    }, [personas, searchValue]);

    const handleViewChange = (view: View) => {
        setCurrentView(view);
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
            />

            <div className="min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
}
