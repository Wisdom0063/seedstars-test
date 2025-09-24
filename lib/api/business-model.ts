import { ApiResponse, fetcher } from ".";
import type {
  BusinessModel,
  ValuePropositionStatement,
  ValueProposition,
} from '@prisma/client';

export interface BusinessModelWithRelations extends Omit<BusinessModel, 'keyPartners' | 'keyActivities' | 'keyResources' | 'customerRelationships' | 'channels' | 'customerSegments' | 'costStructure' | 'revenueStreams' | 'tags'> {
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
  tags: string[];

  valuePropositionStatement: ValuePropositionStatement & {
    valueProposition: ValueProposition & {
      segment: {
        id: string;
        name: string;
      };
      persona?: {
        id: string;
        name: string;
      } | null;
    };
  };
}

export interface CreateBusinessModelRequest {
  name: string;
  description?: string;
  status?: string;
  valuePropositionStatementId: string;

  keyPartners?: string[];
  keyActivities?: string[];
  keyResources?: string[];
  customerRelationships?: string[];
  channels?: string[];
  customerSegments?: string[];
  costStructure?: string[];
  revenueStreams?: string[];

  tags?: string[];
  notes?: string;
  createdBy?: string;
}

export interface UpdateBusinessModelRequest {
  id: string;
  name?: string;
  description?: string;
  status?: string;

  keyPartners?: string[];
  keyActivities?: string[];
  keyResources?: string[];
  customerRelationships?: string[];
  channels?: string[];
  customerSegments?: string[];
  costStructure?: string[];
  revenueStreams?: string[];

  tags?: string[];
  notes?: string;
  updatedBy?: string;
}

export const businessModelsApi = {
  getAll: (): Promise<ApiResponse<BusinessModelWithRelations[]>> => {
    return fetcher<BusinessModelWithRelations[]>('/api/business-models');
  },

  update: (data: UpdateBusinessModelRequest): Promise<ApiResponse<BusinessModelWithRelations>> => {
    return fetcher<BusinessModelWithRelations>(`/api/business-models/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },


};
