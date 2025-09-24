"use client";

import { Persona } from '@/lib/api/customer-segment';
import { PersonaViewManager } from '@/components/views/customer-segment/persona-view-manager';
import { LoadingState } from '@/components/ui/custom/loading-state';
import { ErrorState } from '@/components/ui/custom/error-state';
import { EmptyState } from '@/components/ui/custom/empty-state';
import { Users } from 'lucide-react';
import { usePersonas } from '@/hooks/usePersonas';

export default function CustomerSegmentsPage() {
    const { personas, loading, error, refetch, setPersonas } = usePersonas();

    const handlePersonaClick = (persona: Persona) => {
    };

    const handlePersonaMove = (personaId: string, newSegmentId: string) => {
    };

    const handlePersonaUpdate = (updatedPersona: Persona) => {
        // For now, just refetch all data. In a real app, you might want to update the local state
        refetch();
    };

    if (loading) {
        return <LoadingState message="Loading personas..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={refetch}
            />
        );
    }

    return (
        <div className="container mx-auto lg:px-4 px-1">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Personas</h1>
                <p className="text-gray-600">
                    Explore detailed personas across different customer segments
                </p>
            </div>

            {personas.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No personas found"
                    description="Try running the seed script to populate data"
                />
            ) : (
                <PersonaViewManager
                    personas={personas}
                    onPersonaClick={handlePersonaClick}
                    onPersonaMove={handlePersonaMove}
                    onPersonaUpdate={handlePersonaUpdate}
                />
            )}
        </div>
    );
}



