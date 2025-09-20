"use client";

import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';
import { Persona } from '@/lib/api/customer-segment';
import { ViewManager } from '@/components/views/view-manager';
import { ViewSource } from '@/lib/api/views';

export default function CustomerSegmentsPage() {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPersonas();
    }, []);

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

    const handlePersonaClick = (persona: Persona) => {
        console.log('Persona clicked:', persona);
        // TODO: Implement persona detail view or modal
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading personas...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-red-800 font-semibold mb-2">Error</h2>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchPersonas}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Personas</h1>
                <p className="text-gray-600">
                    Explore detailed personas across different customer segments
                </p>
            </div>

            {/* Personas Views */}
            {personas.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No personas found</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Try running the seed script to populate data
                    </p>
                </div>
            ) : (
                <ViewManager
                    personas={personas}
                    source={ViewSource.PERSONAS}
                    onPersonaClick={handlePersonaClick}
                    onPersonaMove={(personaId, newSegmentId) => {
                        console.log('Move persona:', personaId, 'to segment:', newSegmentId);
                        // TODO: Implement persona move logic
                    }}
                />
            )}
        </div>
    );
}



