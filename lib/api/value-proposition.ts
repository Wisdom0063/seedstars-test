import { fetcher } from ".";
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
  name?: string;
  description?: string;
  status?: ValuePropositionStatus;
  tags?: string[];

  // Complete replacement of canvas components
  customerJobs?: Omit<CustomerJob, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
  customerPains?: Omit<CustomerPain, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
  gainCreators?: Omit<GainCreator, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
  painRelievers?: Omit<PainReliever, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
  productsServices?: Omit<ProductService, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
  valuePropositionStatements?: Omit<ValuePropositionStatement, 'id' | 'valuePropositionId' | 'createdAt' | 'updatedAt'>[];
}

// Value Propositions API
export const valuePropositionsApi = {
  // Get all value propositions
  getAll: (): Promise<ValuePropositionWithRelations[]> => {
    return fetcher<ValuePropositionWithRelations[]>('/api/value-propositions');
  },

  // Update a value proposition
  update: (data: UpdateValuePropositionRequest): Promise<ValuePropositionWithRelations> => {
    return fetcher<ValuePropositionWithRelations>(`/api/value-propositions/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
