"use client";

import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';
import { Persona } from '@/lib/api/customer-segment';
import { PersonaViewManager } from '@/components/views/customer-segment/persona-view-manager';
import { LoadingState } from '@/components/ui/custom/loading-state';
import { ErrorState } from '@/components/ui/custom/error-state';
import { EmptyState } from '@/components/ui/custom/empty-state';
import { Users } from 'lucide-react';

export default function CustomerSegmentsPage() {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPersonas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.personas.getAll();
            setPersonas(data);
        } catch (err) {
            const errorMessage = err instanceof ApiError
                ? err.message
                : 'Failed to fetch personas';
            setError(errorMessage);
            console.error('Error fetching personas:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonas();
    }, []);

    const handlePersonaClick = (persona: Persona) => {
        console.log('Persona clicked:', persona);
    };

    const handlePersonaMove = (personaId: string, newSegmentId: string) => {
        console.log('Persona moved:', personaId, 'to segment:', newSegmentId);
    };

    const handlePersonaUpdate = (updatedPersona: Persona) => {
        console.log('Persona updated in real-time:', updatedPersona);

        // Update the personas state with the new data
        setPersonas(prevPersonas =>
            prevPersonas.map(persona =>
                persona.id === updatedPersona.id ? updatedPersona : persona
            )
        );
    };

    if (loading) {
        return <LoadingState message="Loading personas..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={fetchPersonas}
            />
        );
    }

    return (
        <div className="container mx-auto lg:px-4 px-1">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Personas</h1>
                <p className="text-gray-600">
                    Explore detailed personas across different customer segments
                </p>
            </div>

            {/* Personas Views */}
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
                    onPersonaMove={(personaId, newSegmentId) => {
                        console.log('Move persona:', personaId, 'to segment:', newSegmentId);
                        // TODO: Implement persona move logic
                    }}
                    onPersonaUpdate={handlePersonaUpdate}
                />
            )}
        </div>
    );
}



