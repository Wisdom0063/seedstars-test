'use client';

import React from 'react';
import { GenericViewManager, LayoutComponentProps, ViewManagerConfig } from '../../view-manager/generic-view-manager';
import { PersonaDetailDrawer } from './persona-detail-drawer';
import { ViewLayout, ViewSource } from '@/lib/api/views';
import { Persona, personasApi } from '@/lib/api/customer-segment';
import { PersonaKanban } from './virtusso-kanban';
import PersonaCards from './virtusso-card';
import { PersonaTable } from './virtusso-table';



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



// Persona-specific filter configuration
const personaFilterConfig = {
    getFilterFields: () => {
        const { Users, MapPin, GraduationCap, DollarSign, Tag, User, Calendar, Heart, MessageCircle, Hash } = require('lucide-react');

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
                id: 'locations',
                label: 'Location',
                icon: MapPin,
                type: 'multiselect',
                description: 'Filter by location',
                getOptions: (data: any[]) => getUniqueOptions(data, 'location')
            },
            {
                id: 'education',
                label: 'Education',
                icon: GraduationCap,
                type: 'multiselect',
                description: 'Filter by education level',
                getOptions: (data: any[]) => getUniqueOptions(data, 'education')
            },
            {
                id: 'income',
                label: 'Income Level',
                icon: DollarSign,
                type: 'multiselect',
                description: 'Filter by income level',
                getOptions: (data: any[]) => getUniqueOptions(data, 'incomePerMonth')
            },
            {
                id: 'painPoints',
                label: 'Pain Points',
                icon: Heart,
                type: 'multiselect',
                description: 'Filter by pain points',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'painPoints')
            },
            {
                id: 'channels',
                label: 'Channels',
                icon: MessageCircle,
                type: 'multiselect',
                description: 'Filter by channels',
                getOptions: (data: any[]) => getFlattenedOptions(data, 'channels')
            },
            {
                id: 'gender',
                label: 'Gender',
                icon: User,
                type: 'multiselect',
                description: 'Filter by gender',
                getOptions: (data: any[]) => getUniqueOptions(data, 'gender')
            },
            {
                id: 'age',
                label: 'Age Range',
                icon: Calendar,
                type: 'range',
                description: 'Filter by age range',
                min: 18,
                max: 80
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

    getFilterValue: (persona: Persona, field: string): any => {
        switch (field) {
            case 'segments':
                return persona.segment?.name;
            case 'locations':
                return persona.location;
            case 'education':
                return persona.education;
            case 'income':
                return persona.incomePerMonth;
            case 'painPoints':
                return persona.painPoints;
            case 'channels':
                return persona.channels;
            case 'age':
                return persona.age;
            case 'gender':
                return persona.gender;
            case 'createdAt':
                return persona.createdAt;
            case 'id':
                return persona.id;
            default:
                return null;
        }
    },

    applyFilters: (personas: Persona[], filters: Record<string, any>): Persona[] => {
        let result = [...personas];

        if (filters.segments && filters.segments.length > 0) {
            result = result.filter(persona =>
                filters.segments.includes(persona.segment?.name)
            );
        }

        if (filters.locations && filters.locations.length > 0) {
            result = result.filter(persona =>
                persona.location && filters.locations.includes(persona.location)
            );
        }

        if (filters.education && filters.education.length > 0) {
            result = result.filter(persona =>
                persona.education && filters.education.includes(persona.education)
            );
        }

        if (filters.income && filters.income.length > 0) {
            result = result.filter(persona =>
                persona.incomePerMonth && filters.income.includes(persona.incomePerMonth)
            );
        }

        if (filters.painPoints && filters.painPoints.length > 0) {
            result = result.filter(persona =>
                persona.painPoints && persona.painPoints.some(point =>
                    filters.painPoints.includes(point)
                )
            );
        }

        if (filters.channels && filters.channels.length > 0) {
            result = result.filter(persona =>
                persona.channels && persona.channels.some(channel =>
                    filters.channels.includes(channel)
                )
            );
        }

        if (filters.age) {
            result = result.filter(persona => {
                if (!persona.age) return false;
                const age = parseInt(persona.age.toString());
                if (filters.age.min && age < filters.age.min) return false;
                if (filters.age.max && age > filters.age.max) return false;
                return true;
            });
        }

        if (filters.gender && filters.gender.length > 0) {
            result = result.filter(persona =>
                persona.gender && filters.gender.includes(persona.gender)
            );
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(persona =>
                persona.name.toLowerCase().includes(searchTerm) ||
                persona.description?.toLowerCase().includes(searchTerm) ||
                persona.quote?.toLowerCase().includes(searchTerm) ||
                persona.location?.toLowerCase().includes(searchTerm) ||
                persona.education?.toLowerCase().includes(searchTerm)
            );
        }

        return result;
    }
};

// Persona-specific sort configuration
const personaSortConfig = {
    getNestedValue: (obj: any, path: string): any => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    },

    getSortableFields: () => {
        const { User, Calendar, MapPin, GraduationCap, DollarSign, Users } = require('lucide-react');

        return [
            { id: 'name', label: 'Name', icon: User, field: 'name', type: 'text' as const, description: 'Sort by persona name' },
            { id: 'age', label: 'Age', icon: Calendar, field: 'age', type: 'number' as const, description: 'Sort by persona age' },
            { id: 'segment', label: 'Customer Segment', icon: Users, field: 'segment.name', type: 'text' as const, description: 'Sort by customer segment' },
            { id: 'location', label: 'Location', icon: MapPin, field: 'location', type: 'text' as const, description: 'Sort by location' },
            { id: 'education', label: 'Education', icon: GraduationCap, field: 'education', type: 'text' as const, description: 'Sort by education level' },
            { id: 'income', label: 'Income Level', icon: DollarSign, field: 'incomePerMonth', type: 'number' as const, description: 'Sort by income level' },
            { id: 'gender', label: 'Gender', icon: User, field: 'gender', type: 'text' as const, description: 'Sort by gender' },
            { id: 'createdAt', label: 'Created Date', icon: Calendar, field: 'createdAt', type: 'date' as const, description: 'Sort by creation date' },
            { id: 'updatedAt', label: 'Updated Date', icon: Calendar, field: 'updatedAt', type: 'date' as const, description: 'Sort by update date' }
        ];
    }
};



const personaAvailableProperties = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
    { id: 'segment', label: 'Customer Segment' },
    { id: 'location', label: 'Location' },
    { id: 'education', label: 'Education' },
    { id: 'income', label: 'Income Level' },
    { id: 'gender', label: 'Gender' },
    { id: 'createdAt', label: 'Created Date' },
    { id: 'updatedAt', label: 'Updated Date' }
];

// Wrapper components to match the generic interface
const PersonaCardLayout: React.FC<LayoutComponentProps<Persona>> = (props) => (
    <PersonaCards
        personas={props.data}
        onPersonaClick={props.onItemClick}
        onPersonaReorder={props.onItemReorder}
        visibleFields={props.visibleFields}
    />
);

const PersonaTableLayout: React.FC<LayoutComponentProps<Persona>> = (props) => (
    <PersonaTable
        personas={props.data}
        onPersonaClick={props.onItemClick}
        visibleFields={props.visibleFields}
    />
);

const PersonaKanbanLayout: React.FC<LayoutComponentProps<Persona>> = (props) => (
    <PersonaKanban
        personas={props.data}
        onPersonaClick={props.onItemClick}
        onPersonaMove={props.onItemMove}
        visibleFields={props.visibleFields}
    />
);

// Persona ViewManager configuration
const personaViewConfig: ViewManagerConfig<Persona> = {
    source: ViewSource.PERSONAS,
    layouts: {
        [ViewLayout.CARD]: PersonaCardLayout,
        [ViewLayout.TABLE]: PersonaTableLayout,
        [ViewLayout.KANBAN]: PersonaKanbanLayout,
    },
    filterConfig: personaFilterConfig,
    sortConfig: personaSortConfig,
    availableProperties: personaAvailableProperties,
    defaultVisibleFields: ['name', 'age', 'segment', 'location', 'education']
};

// Persona-specific ViewManager props
export interface PersonaViewManagerProps {
    personas: Persona[];
    onPersonaClick?: (persona: Persona) => void;
    onPersonaMove?: (personaId: string, newSegmentId: string) => void;
    onPersonaUpdate?: (updatedPersona: Persona) => void;
}

// Persona ViewManager component
export function PersonaViewManager({
    personas,
    onPersonaClick,
    onPersonaMove,
    onPersonaUpdate,
}: PersonaViewManagerProps) {
    const renderPersonaDrawer = (persona: Persona | null, isOpen: boolean, onClose: () => void) => (
        <PersonaDetailDrawer
            persona={persona}
            isOpen={isOpen}
            onClose={onClose}
            onRealtimeUpdate={onPersonaUpdate}
            onSave={async (updatedPersona) => {
                try {
                    console.log('Saving persona:', updatedPersona);

                    const result = await personasApi.update(updatedPersona);
                    console.log('Persona saved successfully:', result);

                } catch (error) {
                    console.error('Failed to save persona:', error);
                    throw error;
                }
            }}
            onDelete={async (personaToDelete) => {
                try {
                    await personasApi.delete(personaToDelete.id);
                    onClose();

                } catch (error) {
                    console.error('Failed to delete persona:', error);
                }
            }}
        />
    );

    return (
        <GenericViewManager
            data={personas}
            config={personaViewConfig}
            onItemClick={onPersonaClick} // Still called for backward compatibility
            onItemMove={onPersonaMove}
            renderDetailDrawer={renderPersonaDrawer} // Smart drawer integration
        />
    );
}
