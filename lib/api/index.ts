import { customerSegmentsApi, personasApi } from './customer-segment';

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    error?: string;
    message?: string;
}



// API Error Type
export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public response?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Base fetcher function with proper error handling
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new ApiError(
                `HTTP error! status: ${response.status}`,
                response.status,
                response
            );
        }

        const data: ApiResponse<T> = await response.json();

        if (!data.success) {
            throw new ApiError(data.error || 'API request failed');
        }

        return data.data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Handle network errors, JSON parsing errors, etc.
        throw new ApiError(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
}


// Combined API object for easy importing
export const api = {
    customerSegments: customerSegmentsApi,
    personas: personasApi,
};

// Export the base fetcher for custom requests
export { fetcher };
