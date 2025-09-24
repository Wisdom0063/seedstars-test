import { ApiResponse, fetcher } from ".";
import type {
  ValueProposition,
  ValuePropositionStatement,
  JobImportance,
  JobCategory,
  PainSeverity,
  PainCategory,
  GainPriority,
  GainCategory,
  RelieverPriority,
  RelieverCategory,
  ProductType,
} from '@prisma/client';

// Simplified types for JSON data
export interface CustomerJob {
  title: string;
  description: string;
  importance: JobImportance;
  category?: JobCategory;
}

export interface CustomerPain {
  title: string;
  description: string;
  severity: PainSeverity;
  category?: PainCategory;
}

export interface GainCreator {
  title: string;
  description: string;
  priority: GainPriority;
  category?: GainCategory;
}

export interface PainReliever {
  title: string;
  description: string;
  priority: RelieverPriority;
  category?: RelieverCategory;
}

export interface ProductService {
  name: string;
  description: string;
  type: ProductType;
  category?: string;
  features?: string[];
}

// Extended types with relations and parsed JSON
export interface ValuePropositionWithRelations extends Omit<ValueProposition, 'tags' | 'customerJobs' | 'customerPains' | 'gainCreators' | 'painRelievers' | 'productsServices'> {
  segment: {
    id: string;
    name: string;
  };
  persona?: {
    id: string;
    name: string;
  } | null;
  tags: string[];
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
  customerJobs?: CustomerJob[];
  customerPains?: CustomerPain[];
  gainCreators?: GainCreator[];
  painRelievers?: PainReliever[];
  productsServices?: ProductService[];
  valuePropositionStatements: { offering: string; description: string; }[];
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
