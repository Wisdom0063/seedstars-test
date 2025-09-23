'use client';

import React from 'react';
import { GenericViewManager, LayoutComponentProps, ViewManagerConfig } from '../../view-manager/generic-view-manager';
import { ValuePropositionDetailDrawer } from './value-proposition-detail-drawer';
import { ViewLayout, ViewSource } from '@/lib/api/views';
import { ValuePropositionWithRelations, valuePropositionsApi, UpdateValuePropositionRequest } from '@/lib/api/value-proposition';
import { ValuePropositionKanban } from './kanban';
import ValuePropositionCards from './card';
import { ValuePropositionTable } from './table';

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

// Value Proposition-specific filter configuration
const valuePropositionFilterConfig = {
    getFilterFields: () => {
        const { Users, Lightbulb, Target, Tag, User, Calendar, Hash, AlertTriangle, TrendingUp, Shield, Package } = require('lucide-react');

        return [
            {
                id: 'segments',
                label: 'Customer Segment',
                icon: Users,
                type: 'multiselect',
                description: 'Filter by customer segment',
                getOptions: (data: any[]) => getUniqueOptions(data, 'segment.name', 'segment.id')
            },
            {
                id: 'personas',
                label: 'Persona',
                icon: User,
                type: 'multiselect',
                description: 'Filter by persona',
                getOptions: (data: any[]) => getUniqueOptions(data, 'persona.name', 'persona.id')
            },
            {
                id: 'status',
                label: 'Status',
                icon: Lightbulb,
                type: 'multiselect',
                description: 'Filter by status',
                getOptions: (data: any[]) => getUniqueOptions(data, 'status')
            },
            {
                id: 'valuePropositionStatements',
                label: 'Value Propositions',
                icon: Target,
                type: 'multiselect',
                description: 'Filter by value proposition statements',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'valuePropositionStatements.offering')
            },
            {
                id: 'customerJobs',
                label: 'Customer Jobs',
                icon: Tag,
                type: 'multiselect',
                description: 'Filter by customer jobs',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'customerJobs.title')
            },
            {
                id: 'customerPains',
                label: 'Customer Pains',
                icon: AlertTriangle,
                type: 'multiselect',
                description: 'Filter by customer pains',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'customerPains.title')
            },
            {
                id: 'gainCreators',
                label: 'Gain Creators',
                icon: TrendingUp,
                type: 'multiselect',
                description: 'Filter by gain creators',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'gainCreators.title')
            },
            {
                id: 'painRelievers',
                label: 'Pain Relievers',
                icon: Shield,
                type: 'multiselect',
                description: 'Filter by pain relievers',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'painRelievers.title')
            },
            {
                id: 'productsServices',
                label: 'Products & Services',
                icon: Package,
                type: 'multiselect',
                description: 'Filter by products and services',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'productsServices.name')
            },
            {
                id: 'createdAt',
                label: 'Created Date',
                icon: Calendar,
                type: 'date',
                description: 'Filter by created date'
            },
            {
                id: 'id',
                label: 'ID',
                icon: Hash,
                type: 'text',
                description: 'Filter by ID'
            }
        ];
    },

    getFilterValue: (valueProposition: ValuePropositionWithRelations, field: string): any => {
        switch (field) {
            case 'segments':
                return valueProposition.segment?.name;
            case 'personas':
                return valueProposition.persona?.name;
            case 'status':
                return valueProposition.status;
            case 'valuePropositionStatements':
                return valueProposition.valuePropositionStatements?.map(s => s.offering);
            case 'customerJobs':
                return valueProposition.customerJobs?.map(j => j.title);
            case 'customerPains':
                return valueProposition.customerPains?.map(p => p.title);
            case 'gainCreators':
                return valueProposition.gainCreators?.map(g => g.title);
            case 'painRelievers':
                return valueProposition.painRelievers?.map(r => r.title);
            case 'productsServices':
                return valueProposition.productsServices?.map(p => p.name);
            case 'createdAt':
                return valueProposition.createdAt;
            case 'id':
                return valueProposition.id;
            default:
                return null;
        }
    },

    applyFilters: (valuePropositions: ValuePropositionWithRelations[], filters: Record<string, any>): ValuePropositionWithRelations[] => {
        let result = [...valuePropositions];

        if (filters.segments && filters.segments.length > 0) {
            result = result.filter(vp =>
                filters.segments.includes(vp.segment?.name)
            );
        }

        if (filters.personas && filters.personas.length > 0) {
            result = result.filter(vp =>
                vp.persona && filters.personas.includes(vp.persona.name)
            );
        }

        if (filters.status && filters.status.length > 0) {
            result = result.filter(vp =>
                filters.status.includes(vp.status)
            );
        }

        if (filters.valuePropositionStatements && filters.valuePropositionStatements.length > 0) {
            result = result.filter(vp =>
                vp.valuePropositionStatements && vp.valuePropositionStatements.some(statement =>
                    filters.valuePropositionStatements.includes(statement.offering)
                )
            );
        }

        if (filters.customerJobs && filters.customerJobs.length > 0) {
            result = result.filter(vp =>
                vp.customerJobs && vp.customerJobs.some(job =>
                    filters.customerJobs.includes(job.title)
                )
            );
        }

        if (filters.customerPains && filters.customerPains.length > 0) {
            result = result.filter(vp =>
                vp.customerPains && vp.customerPains.some(pain =>
                    filters.customerPains.includes(pain.title)
                )
            );
        }

        if (filters.gainCreators && filters.gainCreators.length > 0) {
            result = result.filter(vp =>
                vp.gainCreators && vp.gainCreators.some(gain =>
                    filters.gainCreators.includes(gain.title)
                )
            );
        }

        if (filters.painRelievers && filters.painRelievers.length > 0) {
            result = result.filter(vp =>
                vp.painRelievers && vp.painRelievers.some(reliever =>
                    filters.painRelievers.includes(reliever.title)
                )
            );
        }

        if (filters.productsServices && filters.productsServices.length > 0) {
            result = result.filter(vp =>
                vp.productsServices && vp.productsServices.some(product =>
                    filters.productsServices.includes(product.name)
                )
            );
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(vp =>
                vp.persona?.name.toLowerCase().includes(searchTerm) ||
                vp.segment.name.toLowerCase().includes(searchTerm) ||
                vp.valuePropositionStatements?.some(s =>
                    s.offering.toLowerCase().includes(searchTerm) ||
                    s.description.toLowerCase().includes(searchTerm)
                ) ||
                vp.customerJobs?.some(j =>
                    j.title.toLowerCase().includes(searchTerm) ||
                    j.description.toLowerCase().includes(searchTerm)
                ) ||
                vp.customerPains?.some(p =>
                    p.title.toLowerCase().includes(searchTerm) ||
                    p.description.toLowerCase().includes(searchTerm)
                ) ||
                vp.gainCreators?.some(g =>
                    g.title.toLowerCase().includes(searchTerm) ||
                    g.description.toLowerCase().includes(searchTerm)
                ) ||
                vp.painRelievers?.some(r =>
                    r.title.toLowerCase().includes(searchTerm) ||
                    r.description.toLowerCase().includes(searchTerm)
                ) ||
                vp.productsServices?.some(p =>
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.description.toLowerCase().includes(searchTerm)
                )
            );
        }

        return result;
    }
};

// Value Proposition-specific sort configuration
const valuePropositionSortConfig = {
    getNestedValue: (obj: any, path: string): any => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    },

    getSortableFields: () => {
        const { Lightbulb, Calendar, Users, User, Target } = require('lucide-react');

        return [
            { id: 'persona', label: 'Persona', icon: User, field: 'persona.name', type: 'text' as const, description: 'Sort by persona name' },
            { id: 'segment', label: 'Customer Segment', icon: Users, field: 'segment.name', type: 'text' as const, description: 'Sort by customer segment' },
            { id: 'createdAt', label: 'Created Date', icon: Calendar, field: 'createdAt', type: 'date' as const, description: 'Sort by creation date' },
            { id: 'updatedAt', label: 'Updated Date', icon: Calendar, field: 'updatedAt', type: 'date' as const, description: 'Sort by update date' }
        ];
    }
};

const valuePropositionAvailableProperties = [
    { id: 'name', label: 'Name' }, // This will show persona name
    { id: 'segment', label: 'Customer Segment' },
    { id: 'persona', label: 'Persona' },
    { id: 'valuePropositionStatements', label: 'Value Propositions' },
    { id: 'customerJobs', label: 'Customer Jobs' },
    { id: 'customerPains', label: 'Customer Pains' },
    { id: 'gainCreators', label: 'Gain Creators' },
    { id: 'painRelievers', label: 'Pain Relievers' },
    { id: 'productsServices', label: 'Products & Services' },
    { id: 'createdAt', label: 'Created Date' },
    { id: 'updatedAt', label: 'Updated Date' }
];

// Wrapper components to match the generic interface
const ValuePropositionCardLayout: React.FC<LayoutComponentProps<ValuePropositionWithRelations>> = (props) => (
    <ValuePropositionCards
        valuePropositions={props.data}
        onValuePropositionClick={props.onItemClick}
        onValuePropositionReorder={props.onItemReorder}
        visibleFields={props.visibleFields}
    />
);

const ValuePropositionTableLayout: React.FC<LayoutComponentProps<ValuePropositionWithRelations>> = (props) => (
    <ValuePropositionTable
        valuePropositions={props.data}
        onValuePropositionClick={props.onItemClick}
        visibleFields={props.visibleFields}
    />
);

const ValuePropositionKanbanLayout: React.FC<LayoutComponentProps<ValuePropositionWithRelations>> = (props) => (
    <ValuePropositionKanban
        valuePropositions={props.data}
        onValuePropositionClick={props.onItemClick}
        onValuePropositionMove={props.onItemMove}
        visibleFields={props.visibleFields}
    />
);

// Value Proposition ViewManager configuration
const valuePropositionViewConfig: ViewManagerConfig<ValuePropositionWithRelations> = {
    source: ViewSource.VALUE_PROPOSITIONS,
    layouts: {
        [ViewLayout.CARD]: ValuePropositionCardLayout,
        [ViewLayout.TABLE]: ValuePropositionTableLayout,
        [ViewLayout.KANBAN]: ValuePropositionKanbanLayout,
    },
    filterConfig: valuePropositionFilterConfig,
    sortConfig: valuePropositionSortConfig,
    availableProperties: valuePropositionAvailableProperties,
    defaultVisibleFields: ['name', 'segment', 'persona', 'valuePropositionStatements']
};

// Value Proposition-specific ViewManager props
export interface ValuePropositionViewManagerProps {
    valuePropositions: ValuePropositionWithRelations[];
    onValuePropositionClick?: (valueProposition: ValuePropositionWithRelations) => void;
    onValuePropositionMove?: (valuePropositionId: string, newSegmentId: string) => void;
    onValuePropositionUpdate?: (updatedValueProposition: ValuePropositionWithRelations) => void;
}

// Value Proposition ViewManager component
export function ValuePropositionViewManager({
    valuePropositions,
    onValuePropositionClick,
    onValuePropositionMove,
    onValuePropositionUpdate,
}: ValuePropositionViewManagerProps) {
    const renderValuePropositionDrawer = (valueProposition: ValuePropositionWithRelations | null, isOpen: boolean, onClose: () => void) => (
        <ValuePropositionDetailDrawer
            valueProposition={valueProposition}
            isOpen={isOpen}
            onClose={onClose}
            onRealtimeUpdate={onValuePropositionUpdate}
            onSave={async (updateRequest: UpdateValuePropositionRequest) => {
                try {
                    console.log('Saving value proposition:', updateRequest);

                    const result = await valuePropositionsApi.update(updateRequest);
                    console.log('Value proposition saved successfully:', result);

                } catch (error) {
                    console.error('Failed to save value proposition:', error);
                    throw error;
                }
            }}
            onDelete={async (valuePropositionToDelete) => {
                try {
                    // Note: Delete API not implemented yet, would need to add to valuePropositionsApi
                    console.log('Delete value proposition:', valuePropositionToDelete.id);
                    onClose();

                } catch (error) {
                    console.error('Failed to delete value proposition:', error);
                }
            }}
        />
    );

    return (
        <GenericViewManager
            data={valuePropositions}
            config={valuePropositionViewConfig}
            onItemClick={onValuePropositionClick} // Still called for backward compatibility
            onItemMove={onValuePropositionMove}
            renderDetailDrawer={renderValuePropositionDrawer} // Smart drawer integration
        />
    );
}
