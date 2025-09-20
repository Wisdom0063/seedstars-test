"use client";

import { useState, useEffect } from 'react';
import PersonaCards, { PersonaCard } from '@/components/views/customer-segment/card';
import { api, ApiError } from '@/lib/api';
import { Persona } from '@/lib/api/customer-segment';
import { PersonaTable } from '@/components/views/customer-segment/table';
import { PersonaKanban } from '@/components/views/customer-segment/kanban';

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
            const personas = await api.personas.getAll();
            setPersonas(personas);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePersonaClick = (persona: Persona) => {
        console.log('Clicked persona:', persona);
        // You can add navigation or modal logic here
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Personas</h1>
                <p className="text-gray-600">
                    Explore detailed personas across different customer segments
                </p>
                <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        {personas.length} {personas.length === 1 ? 'persona' : 'personas'} found
                    </span>
                </div>
            </div>

            {/* Personas Grid */}
            {personas.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No personas found</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Try running the seed script to populate data
                    </p>
                </div>
            ) : (
                // <PersonaCards personas={personas} />

                // <PersonaTable personas={personas} />
                <PersonaKanban personas={personas} />
            )}
        </div>
    );
}



