'use client';

import React from 'react';
import { GenericViewManager, LayoutComponentProps, ViewManagerConfig, FilterConfig, SortConfig } from '../../view-manager/generic-view-manager';
import { BusinessModelDetailDrawer } from './business-model-detail-drawer';
import { ViewLayout, ViewSource } from '@/lib/api/views';
import { BusinessModelWithRelations, businessModelsApi, UpdateBusinessModelRequest } from '@/lib/api/business-model';
import { BusinessModelKanban } from './kanban';
import BusinessModelCards from './card';
import { BusinessModelTable } from './table';

// Helper functions
function getUniqueOptions(data: any[], path: string, valuePath?: string): Array<{ id: string, label: string, value: any, count: number }> {
    const values = new Map<string, { label: string; value: any; count: number }>();

    data.forEach(item => {
        const value = getNestedValue(item, path);
        const key = getNestedValue(item, valuePath || path);

        if (value && key) {
            const existing = values.get(key);
            if (existing) {
                existing.count++;
            } else {
                values.set(key, { label: value, value: key, count: 1 });
            }
        }
    });

    return Array.from(values.entries()).map(([id, data]) => ({
        id,
        label: data.label,
        value: data.value,
        count: data.count,
    }));
}

function getFlattenedOptions(data: any[], path: string): Array<{ id: string, label: string, value: any, count: number }> {
    const values = new Map<string, number>();

    data.forEach(item => {
        const array = getNestedValue(item, path);
        if (Array.isArray(array)) {
            array.forEach(value => {
                if (value) {
                    values.set(value, (values.get(value) || 0) + 1);
                }
            });
        }
    });

    return Array.from(values.entries()).map(([value, count]) => ({
        id: value,
        label: value,
        value,
        count,
    }));
}

function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Business Model-specific filter configuration
const businessModelFilterConfig: FilterConfig = {
    getFilterFields: () => {
        const { Building2, Users, User, Target, Lightbulb, Calendar, Hash, Tag, Package, DollarSign, TrendingUp } = require('lucide-react');

        return [
            {
                id: 'segments',
                label: 'Customer Segment',
                icon: Users,
                type: 'multiselect',
                description: 'Filter by customer segment',
                getOptions: (data: any[]) => getUniqueOptions(data, 'valuePropositionStatement.valueProposition.segment.name', 'valuePropositionStatement.valueProposition.segment.id')
            },
            {
                id: 'personas',
                label: 'Persona',
                icon: User,
                type: 'multiselect',
                description: 'Filter by persona',
                getOptions: (data: any[]) => getUniqueOptions(data, 'valuePropositionStatement.valueProposition.persona.name', 'valuePropositionStatement.valueProposition.persona.id')
            },
            {
                id: 'status',
                label: 'Status',
                icon: Target,
                type: 'multiselect',
                description: 'Filter by status',
                getOptions: (data: any[]) => getUniqueOptions(data, 'status')
            },
            {
                id: 'keyPartners',
                label: 'Key Partners',
                icon: Building2,
                type: 'multiselect',
                description: 'Filter by key partners',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'keyPartners')
            },
            {
                id: 'keyActivities',
                label: 'Key Activities',
                icon: Lightbulb,
                type: 'multiselect',
                description: 'Filter by key activities',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'keyActivities')
            },
            {
                id: 'customerSegments',
                label: 'Customer Segments',
                icon: Users,
                type: 'multiselect',
                description: 'Filter by customer segments',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'customerSegments')
            },
            {
                id: 'channels',
                label: 'Channels',
                icon: Package,
                type: 'multiselect',
                description: 'Filter by channels',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'channels')
            },
            {
                id: 'revenueStreams',
                label: 'Revenue Streams',
                icon: DollarSign,
                type: 'multiselect',
                description: 'Filter by revenue streams',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'revenueStreams')
            },
            {
                id: 'createdAt',
                label: 'Created Date',
                icon: Calendar,
                type: 'daterange',
                description: 'Filter by creation date'
            },
            {
                id: 'id',
                label: 'Business Model ID',
                icon: Hash,
                type: 'text',
                description: 'Search by business model ID'
            }
        ];
    },

    getFilterValue: (businessModel: BusinessModelWithRelations, fieldId: string) => {
        switch (fieldId) {
            case 'segments':
                return businessModel.valuePropositionStatement?.valueProposition?.segment?.name;
            case 'personas':
                return businessModel.valuePropositionStatement?.valueProposition?.persona?.name;
            case 'status':
                return businessModel.status;
            case 'keyPartners':
                return businessModel.keyPartners;
            case 'keyActivities':
                return businessModel.keyActivities;
            case 'customerSegments':
                return businessModel.customerSegments;
            case 'channels':
                return businessModel.channels;
            case 'revenueStreams':
                return businessModel.revenueStreams;
            case 'createdAt':
                return businessModel.createdAt;
            case 'id':
                return businessModel.id;
            default:
                return null;
        }
    },

    applyFilters: (businessModels: BusinessModelWithRelations[], filters: Record<string, any>): BusinessModelWithRelations[] => {
        let result = [...businessModels];

        if (filters.segments && filters.segments.length > 0) {
            result = result.filter(bm =>
                filters.segments.includes(bm.valuePropositionStatement?.valueProposition?.segment?.name)
            );
        }

        if (filters.personas && filters.personas.length > 0) {
            result = result.filter(bm =>
                bm.valuePropositionStatement?.valueProposition?.persona &&
                filters.personas.includes(bm.valuePropositionStatement.valueProposition.persona.name)
            );
        }

        if (filters.status && filters.status.length > 0) {
            result = result.filter(bm => filters.status.includes(bm.status));
        }

        if (filters.keyPartners && filters.keyPartners.length > 0) {
            result = result.filter(bm =>
                bm.keyPartners?.some(partner => filters.keyPartners.includes(partner))
            );
        }

        if (filters.keyActivities && filters.keyActivities.length > 0) {
            result = result.filter(bm =>
                bm.keyActivities?.some(activity => filters.keyActivities.includes(activity))
            );
        }

        if (filters.customerSegments && filters.customerSegments.length > 0) {
            result = result.filter(bm =>
                bm.customerSegments?.some(segment => filters.customerSegments.includes(segment))
            );
        }

        if (filters.channels && filters.channels.length > 0) {
            result = result.filter(bm =>
                bm.channels?.some(channel => filters.channels.includes(channel))
            );
        }

        if (filters.revenueStreams && filters.revenueStreams.length > 0) {
            result = result.filter(bm =>
                bm.revenueStreams?.some(stream => filters.revenueStreams.includes(stream))
            );
        }

        if (filters.id) {
            result = result.filter(bm =>
                bm.id.toLowerCase().includes(filters.id.toLowerCase())
            );
        }

        if (filters.createdAt && (filters.createdAt.from || filters.createdAt.to)) {
            result = result.filter(bm => {
                const createdAt = new Date(bm.createdAt);
                if (filters.createdAt.from && createdAt < new Date(filters.createdAt.from)) {
                    return false;
                }
                if (filters.createdAt.to && createdAt > new Date(filters.createdAt.to)) {
                    return false;
                }
                return true;
            });
        }

        return result;
    }
};

// Business Model-specific sort configuration
const businessModelSortConfig: SortConfig = {
    getNestedValue: (obj: any, path: string) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    },
    
    getSortableFields: () => {
        const { Building2, Users, User, Target, Calendar, Hash } = require('lucide-react');
        
        return [
            {
                id: 'name',
                label: 'Name',
                icon: Building2,
                field: 'name',
                type: 'text'
            },
            {
                id: 'status',
                label: 'Status',
                icon: Target,
                field: 'status',
                type: 'text'
            },
            {
                id: 'segment',
                label: 'Segment',
                icon: Users,
                field: 'valuePropositionStatement.valueProposition.segment.name',
                type: 'text'
            },
            {
                id: 'persona',
                label: 'Persona',
                icon: User,
                field: 'valuePropositionStatement.valueProposition.persona.name',
                type: 'text'
            },
            {
                id: 'createdAt',
                label: 'Created Date',
                icon: Calendar,
                field: 'createdAt',
                type: 'date'
            },
            {
                id: 'updatedAt',
                label: 'Updated Date',
                icon: Calendar,
                field: 'updatedAt',
                type: 'date'
            }
        ];
    }
};

// Available properties for field selection
const businessModelAvailableProperties = [
    { id: 'name', label: 'Name' },
    { id: 'description', label: 'Description' },
    { id: 'status', label: 'Status' },
    { id: 'segment', label: 'Customer Segment' },
    { id: 'persona', label: 'Persona' },
    { id: 'valuePropositionStatement', label: 'Value Proposition' },
    { id: 'keyPartners', label: 'Key Partners' },
    { id: 'keyActivities', label: 'Key Activities' },
    { id: 'keyResources', label: 'Key Resources' },
    { id: 'customerRelationships', label: 'Customer Relationships' },
    { id: 'channels', label: 'Channels' },
    { id: 'customerSegments', label: 'Customer Segments' },
    { id: 'costStructure', label: 'Cost Structure' },
    { id: 'revenueStreams', label: 'Revenue Streams' },
    { id: 'tags', label: 'Tags' },
    { id: 'notes', label: 'Notes' },
    { id: 'createdAt', label: 'Created Date' },
    { id: 'updatedAt', label: 'Updated Date' }
];

// Wrapper components to match the generic interface
const BusinessModelCardLayout: React.FC<LayoutComponentProps<BusinessModelWithRelations>> = (props) => (
    <BusinessModelCards
        businessModels={props.data}
        onBusinessModelClick={props.onItemClick}
        onBusinessModelReorder={props.onItemReorder}
        visibleFields={props.visibleFields}
    />
);

const BusinessModelTableLayout: React.FC<LayoutComponentProps<BusinessModelWithRelations>> = (props) => (
    <BusinessModelTable
        businessModels={props.data}
        onBusinessModelClick={props.onItemClick}
        visibleFields={props.visibleFields}
    />
);

const BusinessModelKanbanLayout: React.FC<LayoutComponentProps<BusinessModelWithRelations>> = (props) => (
    <BusinessModelKanban
        businessModels={props.data}
        onBusinessModelClick={props.onItemClick}
        onBusinessModelMove={props.onItemMove}
        visibleFields={props.visibleFields}
    />
);

// Business Model ViewManager configuration
const businessModelViewConfig: ViewManagerConfig<BusinessModelWithRelations> = {
    source: ViewSource.BUSINESS_MODEL,
    layouts: {
        [ViewLayout.CARD]: BusinessModelCardLayout,
        [ViewLayout.TABLE]: BusinessModelTableLayout,
        [ViewLayout.KANBAN]: BusinessModelKanbanLayout,
    },
    filterConfig: businessModelFilterConfig,
    sortConfig: businessModelSortConfig,
    availableProperties: businessModelAvailableProperties,
    defaultVisibleFields: ['name', 'status', 'segment', 'persona', 'valuePropositionStatement']
};

// Business Model-specific ViewManager props
export interface BusinessModelViewManagerProps {
    businessModels: BusinessModelWithRelations[];
    onBusinessModelClick?: (businessModel: BusinessModelWithRelations) => void;
    onBusinessModelMove?: (businessModelId: string, newStatus: string) => void;
    onBusinessModelUpdate?: (updatedBusinessModel: BusinessModelWithRelations) => void;
}

// Business Model ViewManager component
export function BusinessModelViewManager({
    businessModels,
    onBusinessModelClick,
    onBusinessModelMove,
    onBusinessModelUpdate,
}: BusinessModelViewManagerProps) {
    const renderBusinessModelDrawer = (businessModel: BusinessModelWithRelations | null, isOpen: boolean, onClose: () => void) => (
        <BusinessModelDetailDrawer
            businessModel={businessModel}
            isOpen={isOpen}
            onClose={onClose}
            onRealtimeUpdate={onBusinessModelUpdate}
            onSave={async (updateRequest: UpdateBusinessModelRequest) => {
                try {
                    console.log('Saving business model:', updateRequest);

                    const result = await businessModelsApi.update(updateRequest);
                    console.log('Business model saved successfully:', result);

                } catch (error) {
                    console.error('Failed to save business model:', error);
                    throw error;
                }
            }}
            onDelete={async (businessModelToDelete) => {
                try {
                    // Note: Delete API not implemented yet, would need to add to businessModelsApi
                    console.log('Delete business model:', businessModelToDelete.id);
                    onClose();

                } catch (error) {
                    console.error('Failed to delete business model:', error);
                }
            }}
        />
    );

    return (
        <GenericViewManager
            data={businessModels}
            config={businessModelViewConfig}
            onItemClick={onBusinessModelClick}
            onItemMove={onBusinessModelMove}
            renderDetailDrawer={renderBusinessModelDrawer}
        />
    );
}
