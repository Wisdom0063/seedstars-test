"use client";

import { useState, useEffect } from 'react';
import { ValuePropositionWithRelations, valuePropositionsApi } from '@/lib/api/value-proposition';
import { ValuePropositionViewManager } from '@/components/views/value-proposition/value-proposition-view-manager';

export default function ValuePropositionsPage() {
    const [valuePropositions, setValuePropositions] = useState<ValuePropositionWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        fetchValuePropositions();
    }, []);

    const fetchValuePropositions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await valuePropositionsApi.getAll();
            setValuePropositions(data);
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to fetch value propositions';
            setError(errorMessage);
            console.error('Error fetching value propositions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleValuePropositionClick = (valueProposition: ValuePropositionWithRelations) => {
        console.log('Value proposition clicked:', valueProposition);
    };

    const handleValuePropositionMove = (valuePropositionId: string, newSegmentId: string) => {
        console.log('Value proposition moved:', valuePropositionId, 'to segment:', newSegmentId);
    };

    const handleValuePropositionUpdate = (updatedValueProposition: ValuePropositionWithRelations) => {
        console.log('Value proposition updated in real-time:', updatedValueProposition);

        // Update the value propositions state with the new data
        setValuePropositions(prevValuePropositions =>
            prevValuePropositions.map(vp =>
                vp.id === updatedValueProposition.id ? updatedValueProposition : vp
            )
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading value propositions...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-red-800 font-semibold mb-2">Error</h2>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchValuePropositions}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Value Propositions</h1>
                <p className="text-gray-600">
                    Explore and manage value proposition canvases across different customer segments
                </p>
            </div>

            {/* Value Propositions Views */}
            {valuePropositions.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No value propositions found</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Try running the seed script to populate data
                    </p>
                </div>
            ) : (
                <ValuePropositionViewManager
                    valuePropositions={valuePropositions}
                    onValuePropositionClick={handleValuePropositionClick}
                    onValuePropositionMove={(valuePropositionId, newSegmentId) => {
                        console.log('Move value proposition:', valuePropositionId, 'to segment:', newSegmentId);
                        // TODO: Implement value proposition move logic
                    }}
                    onValuePropositionUpdate={handleValuePropositionUpdate}
                />
            )}
        </div>
    );
}
