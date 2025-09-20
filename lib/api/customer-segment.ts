import { fetcher } from ".";



// Customer Segment Types
export interface CustomerSegment {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    personas?: Persona[];
}

// Persona Types
export interface Persona {
    id: string;
    name: string;
    age?: number;
    gender?: string;
    location?: string;
    education?: string;
    incomePerMonth?: string;
    painPoints?: string[];
    purchasingBehavior?: {
        description?: string;
        preferences?: string;
    };
    channels?: string[];
    quote?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    segment: {
        id: string;
        name: string;
    };
}
// Customer Segments API
export const customerSegmentsApi = {
    // Get all customer segments
    getAll: (): Promise<CustomerSegment[]> => {
        return fetcher<CustomerSegment[]>('/api/customer-segments');
    },

    // Get a specific customer segment by ID
    getById: (id: string): Promise<CustomerSegment> => {
        return fetcher<CustomerSegment>(`/api/customer-segments/${id}`);
    },

    // Create a new customer segment
    create: (data: { name: string }): Promise<CustomerSegment> => {
        return fetcher<CustomerSegment>('/api/customer-segments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Update a customer segment
    update: (id: string, data: { name: string }): Promise<CustomerSegment> => {
        return fetcher<CustomerSegment>(`/api/customer-segments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // Delete a customer segment
    delete: (id: string): Promise<{ message: string }> => {
        return fetcher<{ message: string }>(`/api/customer-segments/${id}`, {
            method: 'DELETE',
        });
    },
};

// Personas API
export const personasApi = {
    // Get all personas
    getAll: (segmentId?: string): Promise<Persona[]> => {
        const url = segmentId
            ? `/api/customer-segments/personas?segmentId=${segmentId}`
            : '/api/customer-segments/personas';
        return fetcher<Persona[]>(url);
    },

    // Get a specific persona by ID
    getById: (id: string): Promise<Persona> => {
        return fetcher<Persona>(`/api/personas/${id}`);
    },

    // Create a new persona
    create: (data: Omit<Persona, 'id' | 'createdAt' | 'updatedAt' | 'segment'> & { segmentId: string }): Promise<Persona> => {
        return fetcher<Persona>('/api/personas', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Update a persona
    update: (id: string, data: Partial<Omit<Persona, 'id' | 'createdAt' | 'updatedAt' | 'segment'>>): Promise<Persona> => {
        return fetcher<Persona>(`/api/personas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // Delete a persona
    delete: (id: string): Promise<{ message: string }> => {
        return fetcher<{ message: string }>(`/api/personas/${id}`, {
            method: 'DELETE',
        });
    },
};