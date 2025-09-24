import { useState, useEffect } from 'react';
import { Persona } from '@/lib/api/customer-segment';
import { api } from '@/lib/api/combined';
import { ApiError } from '@/lib/api';

interface UsePersonasOptions {
    segmentId?: string;
    autoFetch?: boolean;
}

interface UsePersonasReturn {
    personas: Persona[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updatePersona: (updatedPersona: Persona) => void;
}

export function usePersonas(options: UsePersonasOptions = {}): UsePersonasReturn {
    const { segmentId, autoFetch = true } = options;

    const [personas, setPersonas] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPersonas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.personas.getAll(segmentId);
            setPersonas(response.data);
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

    const updatePersona = (updatedPersona: Persona) => {
        setPersonas(prevPersonas =>
            prevPersonas.map(persona =>
                persona.id === updatedPersona.id ? updatedPersona : persona
            )
        );
    };

    useEffect(() => {
        fetchPersonas();
    }, []);

    return {
        personas,
        loading,
        error,
        refetch: fetchPersonas,
        updatePersona
    };
}
