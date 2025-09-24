"use client";

import { BusinessModelWithRelations } from '@/lib/api/business-model';
import { BusinessModelViewManager } from '@/components/views/business-model/business-model-view-manager';
import { LoadingState } from '@/components/ui/custom/loading-state';
import { ErrorState } from '@/components/ui/custom/error-state';
import { EmptyState } from '@/components/ui/custom/empty-state';
import { Building2 } from 'lucide-react';
import { useBusinessModels } from '@/hooks/useBusinessModels';

export default function BusinessModelsPage() {
    const { businessModels, loading, error, refetch, setBusinessModels } = useBusinessModels();



    const handleBusinessModelClick = (businessModel: BusinessModelWithRelations) => {
    };

    const handleBusinessModelMove = (businessModelId: string, newSegmentId: string) => {
    };

    const handleBusinessModelUpdate = (updatedBusinessModel: BusinessModelWithRelations) => {
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
                onRetry={refetch}
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
                    onBusinessModelMove={handleBusinessModelMove}
                    onBusinessModelUpdate={handleBusinessModelUpdate}
                />
            )}
        </div>
    );
}