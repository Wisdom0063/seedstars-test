"use client";

import { useState, useEffect } from 'react';
import { BusinessModelWithRelations, businessModelsApi } from '@/lib/api/business-model';
import { BusinessModelViewManager } from '@/components/views/business-model/business-model-view-manager';
import { LoadingState } from '@/components/ui/custom/loading-state';
import { ErrorState } from '@/components/ui/custom/error-state';
import { EmptyState } from '@/components/ui/custom/empty-state';
import { Building2 } from 'lucide-react';

export default function BusinessModelsPage() {
    const [businessModels, setBusinessModels] = useState<BusinessModelWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    useEffect(() => {
        fetchBusinessModels();
    }, []);



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
        return <LoadingState message="Loading business models..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={fetchBusinessModels}
            />
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
                <EmptyState
                    icon={Building2}
                    title="No business models found"
                    description="Try running the seed script to populate data"
                />
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