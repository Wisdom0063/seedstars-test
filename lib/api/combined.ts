import { customerSegmentsApi, personasApi } from './customer-segment';
import { viewsApi } from './views';

// Combined API object for easy importing
export const api = {
    customerSegments: customerSegmentsApi,
    personas: personasApi,
    views: viewsApi,
};
