'use client';

import React from 'react';
import { PersonaViewManager } from './persona-view-manager';
import { ViewSource } from '@/lib/api/views';
import { Persona } from '@/lib/api/customer-segment';

interface ViewManagerProps {
    personas: Persona[];
    source: ViewSource;
    onPersonaClick?: (persona: Persona) => void;
    onPersonaMove?: (personaId: string, newSegmentId: string) => void;
}

export function ViewManager({
    personas,
    source,
    onPersonaClick,
    onPersonaMove,
}: ViewManagerProps) {
    return (
        <PersonaViewManager
            personas={personas}
            onPersonaClick={onPersonaClick}
            onPersonaMove={onPersonaMove}
        />
    );
}
