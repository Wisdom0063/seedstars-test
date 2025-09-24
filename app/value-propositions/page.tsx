"use client";

import { useState, useEffect } from 'react';
import { ValuePropositionWithRelations, valuePropositionsApi } from '@/lib/api/value-proposition';
import { ValuePropositionViewManager } from '@/components/views/value-proposition/value-proposition-view-manager';
import { LoadingState } from '@/components/ui/custom/loading-state';
import { ErrorState } from '@/components/ui/custom/error-state';
import { EmptyState } from '@/components/ui/custom/empty-state';
import { Target } from 'lucide-react';

export default function ValuePropositionsPage() {
    const [valuePropositions, setValuePropositions] = useState<ValuePropositionWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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


    useEffect(() => {
        fetchValuePropositions();
    }, []);



    const handleValuePropositionClick = (valueProposition: ValuePropositionWithRelations) => {
    };

    const handleValuePropositionMove = (valuePropositionId: string, newSegmentId: string) => {
    };

    const handleValuePropositionUpdate = (updatedValueProposition: ValuePropositionWithRelations) => {
        setValuePropositions(prevValuePropositions =>
            prevValuePropositions.map(vp =>
                vp.id === updatedValueProposition.id ? updatedValueProposition : vp
            )
        );
    };

    if (loading) {
        return <LoadingState message="Loading value propositions..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={fetchValuePropositions}
            />
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Value Propositions</h1>
                <p className="text-gray-600">
                    Explore and manage value proposition canvases across different customer segments
                </p>
            </div>

            {valuePropositions.length === 0 ? (
                <EmptyState
                    icon={Target}
                    title="No value propositions found"
                    description="Try running the seed script to populate data"
                />
            ) : (
                <ValuePropositionViewManager
                    valuePropositions={valuePropositions}
                    onValuePropositionClick={handleValuePropositionClick}
                    onValuePropositionMove={handleValuePropositionMove}
                    onValuePropositionUpdate={handleValuePropositionUpdate}
                />
            )}
        </div>
    );
}
