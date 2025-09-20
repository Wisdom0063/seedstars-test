// Define enums locally since they're not generated yet
export enum ViewSource {
  PERSONAS = 'PERSONAS',
  VALUE_PROPOSITIONS = 'VALUE_PROPOSITIONS',
  BUSINESS_MODEL_CANVAS = 'BUSINESS_MODEL_CANVAS'
}

export enum ViewLayout {
  CARD = 'CARD',
  TABLE = 'TABLE',
  KANBAN = 'KANBAN',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// Base View interface
export interface View {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  source: ViewSource;
  layout: ViewLayout;
  filters?: ViewFilters;
  sortBy?: string;
  sortOrder: SortOrder;
  groupBy?: string;
  visibleFields?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// View filters interface
export interface ViewFilters {
  segments?: string[]; // Filter by customer segment IDs
  ageRange?: {
    min?: number;
    max?: number;
  };
  locations?: string[];
  education?: string[];
  income?: string[];
  painPoints?: string[];
  channels?: string[];
  search?: string; // Global search term
}

// Create view request
export interface CreateViewRequest {
  name: string;
  description?: string;
  source?: ViewSource;
  layout?: ViewLayout;
  filters?: ViewFilters;
  sortBy?: string;
  sortOrder?: SortOrder;
  groupBy?: string;
  visibleFields?: string[];
}

// Update view request
export interface UpdateViewRequest extends Partial<CreateViewRequest> {
  id: string;
}

// View with applied data
export interface ViewWithData {
  view: View;
  totalCount: number;
  filteredCount: number;
}

// Available fields for views
export const PERSONA_FIELDS = {
  name: 'Name',
  age: 'Age',
  gender: 'Gender',
  location: 'Location',
  education: 'Education',
  incomePerMonth: 'Income',
  painPoints: 'Pain Points',
  channels: 'Channels',
  quote: 'Quote',
  description: 'Description',
  segment: 'Customer Segment',
  createdAt: 'Created At',
  updatedAt: 'Updated At',
} as const;

// Sortable fields
export const SORTABLE_FIELDS = [
  'name',
  'age',
  'location',
  'education',
  'incomePerMonth',
  'createdAt',
  'updatedAt',
] as const;

// Groupable fields
export const GROUPABLE_FIELDS = [
  'segment',
  'location',
  'education',
  'incomePerMonth',
  'gender',
] as const;

// Default views configuration
export const DEFAULT_VIEWS: Omit<View, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'All Personas',
    description: 'View all personas across all segments',
    isDefault: true,
    source: ViewSource.PERSONAS,
    layout: ViewLayout.CARD,
    sortBy: 'name',
    sortOrder: SortOrder.ASC,
    visibleFields: ['name', 'age', 'location', 'segment', 'painPoints', 'channels'],
  },
  {
    name: 'Personas by Segment',
    description: 'Kanban view organized by customer segments',
    isDefault: false,
    source: ViewSource.PERSONAS,
    layout: ViewLayout.KANBAN,
    groupBy: 'segment',
    sortBy: 'name',
    sortOrder: SortOrder.ASC,
    visibleFields: ['name', 'age', 'location', 'painPoints', 'channels'],
  },
  {
    name: 'Detailed Table',
    description: 'Comprehensive table view with all persona details',
    isDefault: false,
    source: ViewSource.PERSONAS,
    layout: ViewLayout.TABLE,
    sortBy: 'createdAt',
    sortOrder: SortOrder.DESC,
    visibleFields: Object.keys(PERSONA_FIELDS),
  },
];

export type PersonaField = keyof typeof PERSONA_FIELDS;
export type SortableField = typeof SORTABLE_FIELDS[number];
export type GroupableField = typeof GROUPABLE_FIELDS[number];

// View source labels for UI
export const VIEW_SOURCE_LABELS = {
  [ViewSource.PERSONAS]: 'Personas',
  [ViewSource.VALUE_PROPOSITIONS]: 'Value Propositions',
  [ViewSource.BUSINESS_MODEL_CANVAS]: 'Business Model Canvas',
} as const;

// Views API implementation
export const viewsApi = {
  // Get all views
  async getAll(): Promise<View[]> {
    const response = await fetch('/api/views');
    if (!response.ok) {
      throw new Error('Failed to fetch views');
    }
    const data = await response.json();
    return data.data;
  },

  // Get views by source
  async getBySource(source: ViewSource): Promise<View[]> {
    const response = await fetch(`/api/views?source=${source}`);
    if (!response.ok) {
      throw new Error('Failed to fetch views by source');
    }
    const data = await response.json();
    return data.data;
  },

  // Get view by ID
  async getById(id: string): Promise<View> {
    const response = await fetch(`/api/views/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch view');
    }
    const data = await response.json();
    return data.data;
  },

  // Create new view
  async create(view: CreateViewRequest): Promise<View> {
    const response = await fetch('/api/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(view),
    });
    if (!response.ok) {
      throw new Error('Failed to create view');
    }
    const data = await response.json();
    return data.data;
  },

  // Update view
  async update(view: UpdateViewRequest): Promise<View> {
    const response = await fetch(`/api/views/${view.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(view),
    });
    if (!response.ok) {
      throw new Error('Failed to update view');
    }
    const data = await response.json();
    return data.data;
  },

  // Delete view
  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/views/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete view');
    }
  },

  // Get default view
  async getDefault(): Promise<View> {
    const response = await fetch('/api/views/default');
    if (!response.ok) {
      throw new Error('Failed to fetch default view');
    }
    const data = await response.json();
    return data.data;
  },

  // Set view as default
  async setDefault(id: string): Promise<View> {
    const response = await fetch(`/api/views/${id}/default`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to set default view');
    }
    const data = await response.json();
    return data.data;
  },
};
