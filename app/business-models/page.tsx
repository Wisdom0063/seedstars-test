"use client";

import { useState, useEffect } from 'react';
import { BusinessModelWithRelations, businessModelsApi } from '@/lib/api/business-model';
import { BusinessModelViewManager } from '@/components/views/business-model/business-model-view-manager';

export default function BusinessModelsPage() {
    const [businessModels, setBusinessModels] = useState<BusinessModelWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    console.log('businessModels', businessModels);

    useEffect(() => {
        fetchBusinessModels();
    }, []);

    const fetchBusinessModels = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await businessModelsApi.getAll();
            setBusinessModels(data);
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to fetch business models';
            setError(errorMessage);
            console.error('Error fetching business models:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBusinessModelClick = (businessModel: BusinessModelWithRelations) => {
        console.log('Business model clicked:', businessModel);
    };

    const handleBusinessModelMove = (businessModelId: string, newSegmentId: string) => {
        console.log('Business model moved:', businessModelId, 'to segment:', newSegmentId);
    };

    const handleBusinessModelUpdate = (updatedBusinessModel: BusinessModelWithRelations) => {
        console.log('Business model updated in real-time:', updatedBusinessModel);

        // Update the business models state with the new data
        setBusinessModels(prevBusinessModels =>
            prevBusinessModels.map(bm =>
                bm.id === updatedBusinessModel.id ? updatedBusinessModel : bm
            )
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading business models...</p>
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
                        onClick={fetchBusinessModels}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Models</h1>
                <p className="text-gray-600">
                    Explore and manage business model canvases across different customer segments and value propositions
                </p>
            </div>

            {/* Business Models Views */}
            {businessModels.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No business models found</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Try running the seed script to populate data
                    </p>
                </div>
            ) : (
                <BusinessModelViewManager
                    businessModels={businessModels}
                    onBusinessModelClick={handleBusinessModelClick}
                    onBusinessModelMove={(businessModelId, newSegmentId) => {
                        console.log('Move business model:', businessModelId, 'to segment:', newSegmentId);
                        // TODO: Implement business model move logic
                    }}
                    onBusinessModelUpdate={handleBusinessModelUpdate}
                />
            )}
        </div>
    );
}