'use client';

import React from 'react';
import { GenericViewManager, ViewManagerConfig, LayoutComponentProps } from '../view-manager/generic-view-manager';
import PersonaCards from './customer-segment/card';
import { PersonaTable } from './customer-segment/table';
import { PersonaKanban } from './customer-segment/kanban';
import { ViewLayout, ViewSource } from '@/lib/api/views';
import { Persona } from '@/lib/api/customer-segment';

// Persona-specific filter configuration
const personaFilterConfig = {
    getFilterFields: (source: ViewSource) => {
        const { Users, MapPin, GraduationCap, DollarSign, Tag, User, Calendar } = require('lucide-react');

        return [
            {
                id: 'segments',
                label: 'Customer Segment',
                icon: Users,
                type: 'multiselect',
                description: 'Filter by customer segment'
            },
            {
                id: 'locations',
                label: 'Location',
                icon: MapPin,
                type: 'multiselect',
                description: 'Filter by location'
            },
            {
                id: 'education',
                label: 'Education',
                icon: GraduationCap,
                type: 'multiselect',
                description: 'Filter by education level'
            },
            {
                id: 'income',
                label: 'Income Level',
                icon: DollarSign,
                type: 'multiselect',
                description: 'Filter by income level'
            },
            {
                id: 'painPoints',
                label: 'Pain Points',
                icon: Tag,
                type: 'multiselect',
                description: 'Filter by pain points'
            },
            {
                id: 'channels',
                label: 'Channels',
                icon: Tag,
                type: 'multiselect',
                description: 'Filter by channels'
            },
            {
                id: 'gender',
                label: 'Gender',
                icon: User,
                type: 'multiselect',
                description: 'Filter by gender'
            },
            {
                id: 'age',
                label: 'Age Range',
                icon: Calendar,
                type: 'range',
                description: 'Filter by age range'
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
            default:
                return null;
        }
    },

    applyFilters: (personas: Persona[], filters: Record<string, any>): Persona[] => {
        let result = [...personas];

        // Apply segment filter
        if (filters.segments && filters.segments.length > 0) {
            result = result.filter(persona =>
                filters.segments.includes(persona.segment?.name)
            );
        }

        // Apply location filter
        if (filters.locations && filters.locations.length > 0) {
            result = result.filter(persona =>
                persona.location && filters.locations.includes(persona.location)
            );
        }

        // Apply education filter
        if (filters.education && filters.education.length > 0) {
            result = result.filter(persona =>
                persona.education && filters.education.includes(persona.education)
            );
        }

        // Apply income filter
        if (filters.income && filters.income.length > 0) {
            result = result.filter(persona =>
                persona.incomePerMonth && filters.income.includes(persona.incomePerMonth)
            );
        }

        // Apply pain points filter
        if (filters.painPoints && filters.painPoints.length > 0) {
            result = result.filter(persona =>
                persona.painPoints && persona.painPoints.some(point =>
                    filters.painPoints.includes(point)
                )
            );
        }

        // Apply channels filter
        if (filters.channels && filters.channels.length > 0) {
            result = result.filter(persona =>
                persona.channels && persona.channels.some(channel =>
                    filters.channels.includes(channel)
                )
            );
        }

        // Apply age filter
        if (filters.age) {
            result = result.filter(persona => {
                if (!persona.age) return false;
                const age = parseInt(persona.age.toString());
                if (filters.age.min && age < filters.age.min) return false;
                if (filters.age.max && age > filters.age.max) return false;
                return true;
            });
        }

        // Apply gender filter
        if (filters.gender && filters.gender.length > 0) {
            result = result.filter(persona =>
                persona.gender && filters.gender.includes(persona.gender)
            );
        }

        // Apply search filter
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
            { id: 'name', label: 'Name', icon: User, field: 'name', type: 'text' as const },
            { id: 'age', label: 'Age', icon: Calendar, field: 'age', type: 'number' as const },
            { id: 'segment', label: 'Customer Segment', icon: Users, field: 'segment.name', type: 'text' as const },
            { id: 'location', label: 'Location', icon: MapPin, field: 'location', type: 'text' as const },
            { id: 'education', label: 'Education', icon: GraduationCap, field: 'education', type: 'text' as const },
            { id: 'income', label: 'Income Level', icon: DollarSign, field: 'incomePerMonth', type: 'number' as const },
            { id: 'gender', label: 'Gender', icon: User, field: 'gender', type: 'text' as const },
            { id: 'createdAt', label: 'Created Date', icon: Calendar, field: 'createdAt', type: 'date' as const },
            { id: 'updatedAt', label: 'Updated Date', icon: Calendar, field: 'updatedAt', type: 'date' as const }
        ];
    }
};

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
    defaultVisibleFields: ['name', 'age', 'segment', 'location', 'education']
};

// Persona-specific ViewManager props
export interface PersonaViewManagerProps {
    personas: Persona[];
    onPersonaClick?: (persona: Persona) => void;
    onPersonaMove?: (personaId: string, newSegmentId: string) => void;
}

// Persona ViewManager component
export function PersonaViewManager({
    personas,
    onPersonaClick,
    onPersonaMove,
}: PersonaViewManagerProps) {
    return (
        <GenericViewManager
            data={personas}
            config={personaViewConfig}
            onItemClick={onPersonaClick}
            onItemMove={onPersonaMove}
        />
    );
}
