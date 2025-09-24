import { ApiResponse, fetcher } from ".";
import type {
  ValueProposition,
  CustomerJob,
  CustomerPain,
  GainCreator,
  PainReliever,
  ProductService,
  ValuePropositionStatement,
  ValuePropositionStatus,
} from '@prisma/client';

// Extended types with relations
export interface ValuePropositionWithRelations extends ValueProposition {
  segment: {
    id: string;
    name: string;
  };
  persona?: {
    id: string;
    name: string;
  } | null;
  customerJobs: CustomerJob[];
  customerPains: CustomerPain[];
  gainCreators: GainCreator[];
  painRelievers: PainReliever[];
  productsServices: ProductService[];
  valuePropositionStatements: ValuePropositionStatement[];
}

// Update request type
export interface UpdateValuePropositionRequest {
  id: string;
  tags?: string[];

  // Complete replacement of canvas components
  customerJobs?: Omit<CustomerJob, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
  customerPains?: Omit<CustomerPain, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
  gainCreators?: Omit<GainCreator, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
  painRelievers?: Omit<PainReliever, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
  productsServices?: Omit<ProductService, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
  valuePropositionStatements?: Omit<ValuePropositionStatement, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
}

// Pagination parameters interface
export interface ValuePropositionPaginationParams {
  page?: number;
  limit?: number;
}

// Pagination info interface
export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  count: number;
}

// API response interface for paginated value propositions
export interface ValuePropositionApiResponse {
  success: boolean;
  data: ValuePropositionWithRelations[];
  pagination: PaginationInfo;
}

// Value Propositions API
export const valuePropositionsApi = {
  // Get all value propositions with optional pagination
  getAll: async (params?: ValuePropositionPaginationParams): Promise<ValuePropositionApiResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const url = `/api/value-propositions${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetcher<ValuePropositionApiResponse>(url);
    return response.data;
  },

  // Update a value proposition
  update: (data: UpdateValuePropositionRequest): Promise<ApiResponse<ValuePropositionWithRelations>> => {
    return fetcher<ValuePropositionWithRelations>(`/api/value-propositions/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
