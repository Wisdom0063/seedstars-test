import { useState, useEffect } from 'react';
import { BusinessModelWithRelations, businessModelsApi } from '@/lib/api/business-model';
import { ApiResponse } from '@/lib/api';

interface UseBusinessModelsOptions {
    autoFetch?: boolean;
}

interface UseBusinessModelsReturn {
    businessModels: BusinessModelWithRelations[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    setBusinessModels: React.Dispatch<React.SetStateAction<BusinessModelWithRelations[]>>;
}

export function useBusinessModels(options: UseBusinessModelsOptions = {}): UseBusinessModelsReturn {
    const { autoFetch = true } = options;

    const [businessModels, setBusinessModels] = useState<BusinessModelWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBusinessModels = async () => {
        try {
            setLoading(true);
            setError(null);
            const response: ApiResponse<BusinessModelWithRelations[]> = await businessModelsApi.getAll();
            setBusinessModels(response.data);
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
        if (autoFetch) {
            fetchBusinessModels();
        }
    }, [autoFetch]);

    return {
        businessModels,
        loading,
        error,
        refetch: fetchBusinessModels,
        setBusinessModels
    };
}
