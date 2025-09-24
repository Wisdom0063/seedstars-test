'use client';

import React from 'react';
import { GenericViewManager, LayoutComponentProps, ViewManagerConfig, FilterConfig, SortConfig } from '../../view-manager/generic-view-manager';
import { BusinessModelDetailDrawer } from './business-model-detail-drawer';
import { ViewLayout, ViewSource } from '@/lib/api/views';
import { BusinessModelWithRelations, businessModelsApi, UpdateBusinessModelRequest } from '@/lib/api/business-model';
import { BusinessModelKanban } from './kanban';
import BusinessModelCards from './card';
import { BusinessModelTable } from './table';
import { getUniqueOptions, getFlattenedOptions } from '@/lib/utils';

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
                return businessModel.valuePropositionStatement?.valueProposition?.segment?.id;
            case 'personas':
                return businessModel.valuePropositionStatement?.valueProposition?.persona?.id;
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
                bm.valuePropositionStatement?.valueProposition?.segment &&
                filters.segments.includes(bm.valuePropositionStatement.valueProposition.segment.id)
            );
        }

        if (filters.personas && filters.personas.length > 0) {
            result = result.filter(bm =>
                bm.valuePropositionStatement?.valueProposition?.persona &&
                filters.personas.includes(bm.valuePropositionStatement.valueProposition.persona.id)
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
                field: 'valuePropositionStatement.offering',
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
                id: 'createdAt',
                label: 'Created Date',
                icon: Calendar,
                field: 'createdAt',
                type: 'date'
            },

        ];
    }
};

// Available properties for field selection
const businessModelAvailableProperties = [
    { id: 'valuePropositionStatement', label: 'Value Proposition' },
    { id: 'segment', label: 'Customer Segment' },
    { id: 'persona', label: 'Persona' },
    { id: 'keyPartners', label: 'Key Partners' },
    { id: 'keyActivities', label: 'Key Activities' },
    { id: 'revenueStreams', label: 'Revenue Streams' },
    { id: 'tags', label: 'Tags' },

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
    source: ViewSource.BUSINESS_MODELS,
    layouts: {
        [ViewLayout.CARD]: BusinessModelCardLayout,
        [ViewLayout.TABLE]: BusinessModelTableLayout,
        [ViewLayout.KANBAN]: BusinessModelKanbanLayout,
    },
    filterConfig: businessModelFilterConfig,
    sortConfig: businessModelSortConfig,
    availableProperties: businessModelAvailableProperties,
    defaultVisibleFields: ['valuePropositionStatement', 'segment', 'persona', 'keyPartners', 'keyActivities']
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
            previousPageUrl={"/value-propositions"}
        />
    );
}
