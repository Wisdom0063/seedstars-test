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
export const customerSegmentsApi = {
    getAll: (): Promise<CustomerSegment[]> => {
        return fetcher<CustomerSegment[]>('/api/customer-segments');
    },
    getById: (id: string): Promise<CustomerSegment> => {
        return fetcher<CustomerSegment>(`/api/customer-segments/${id}`);
    },
    create: (data: { name: string }): Promise<CustomerSegment> => {
        return fetcher<CustomerSegment>('/api/customer-segments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: (id: string, data: { name: string }): Promise<CustomerSegment> => {
        return fetcher<CustomerSegment>(`/api/customer-segments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    delete: (id: string): Promise<{ message: string }> => {
        return fetcher<{ message: string }>(`/api/customer-segments/${id}`, {
            method: 'DELETE',
        });
    },
};

export const personasApi = {
    getAll: (segmentId?: string): Promise<Persona[]> => {
        const url = segmentId
            ? `/api/customer-segments/personas?segmentId=${segmentId}`
            : '/api/customer-segments/personas';
        return fetcher<Persona[]>(url);
    },
    getById: (id: string): Promise<Persona> => {
        return fetcher<Persona>(`/api/customer-segments/personas/${id}`);
    },
    create: (data: Omit<Persona, 'id' | 'createdAt' | 'updatedAt' | 'segment'> & { segmentId: string }): Promise<Persona> => {
        return fetcher<Persona>('/api/customer-segments/personas', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: (data: Persona): Promise<Persona> => {
        return fetcher<Persona>('/api/customer-segments/personas', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    delete: (id: string): Promise<{ message: string }> => {
        return fetcher<{ message: string }>(`/api/customer-segments/personas/${id}`, {
            method: 'DELETE',
        });
    },
};