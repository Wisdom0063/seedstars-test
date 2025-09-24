import { useState, useEffect } from 'react';
import { ValuePropositionWithRelations, valuePropositionsApi, ValuePropositionApiResponse } from '@/lib/api/value-proposition';

interface UseValuePropositionsOptions {
    batchSize?: number;
    autoFetch?: boolean;
}

interface UseValuePropositionsReturn {
    valuePropositions: ValuePropositionWithRelations[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    setValuePropositions: React.Dispatch<React.SetStateAction<ValuePropositionWithRelations[]>>;
}

export function useValuePropositions(options: UseValuePropositionsOptions = {}): UseValuePropositionsReturn {
    const { batchSize = 2000, autoFetch = true } = options;

    const [valuePropositions, setValuePropositions] = useState<ValuePropositionWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchValuePropositions = async () => {
        try {
            setLoading(true);
            setError(null);

            let page = 1;
            let allValuePropositions: ValuePropositionWithRelations[] = [];
            let hasMore = true;

            while (hasMore) {
                const response: ValuePropositionApiResponse = await valuePropositionsApi.getAll({
                    page,
                    limit: batchSize
                });

                // Set loading to false after first batch to show progressive loading
                if (page === 1) {
                    setLoading(false);
                }

                if (response.data && response.data.length > 0) {
                    allValuePropositions = [...allValuePropositions, ...response.data];
                    setValuePropositions([...allValuePropositions]);

                    // Check if we have more data to fetch based on pagination info
                    hasMore = response.pagination.hasNextPage;
                    page++;

                    // Small delay between batches to prevent overwhelming the API
                    if (hasMore) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                } else {
                    hasMore = false;
                }
            }
        } catch (err) {
            console.log(err);
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
        if (autoFetch) {
            fetchValuePropositions();
        }
    }, [autoFetch, batchSize]);

    return {
        valuePropositions,
        loading,
        error,
        refetch: fetchValuePropositions,
        setValuePropositions
    };
}
