'use client';

import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, GraduationCap, DollarSign, Quote, Tag, Users } from 'lucide-react';
import { Persona } from '@/lib/api/customer-segment';
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
  type DragEndEvent,
} from '@/components/ui/shadcn-io/kanban';

interface PersonaKanbanProps {
  personas: Persona[];
  onPersonaClick?: (persona: Persona) => void;
  onPersonaMove?: (personaId: string, newSegmentId: string) => void;
  visibleFields?: string[];
}

// Transform Persona to KanbanItem format
interface PersonaKanbanItem extends Record<string, unknown> {
  id: string;
  name: string;
  column: string;
  persona: Persona;
}

// Transform CustomerSegment to KanbanColumn format
interface SegmentKanbanColumn extends Record<string, unknown> {
  id: string;
  name: string;
}

// Persona Card Component for Kanban
function PersonaKanbanCard({
  persona,
  onPersonaClick,
  visibleFields = []
}: {
  persona: Persona;
  onPersonaClick?: (persona: Persona) => void;
  visibleFields?: string[];
}) {
  // Helper function to check if a field should be visible
  const isFieldVisible = (fieldName: string) => {
    return visibleFields.length === 0 || visibleFields.includes(fieldName);
  };
  return (
    <div
      className="space-y-3 cursor-pointer"
      onClick={() => onPersonaClick?.(persona)}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {persona.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          {isFieldVisible('name') && (
            <div className="font-medium text-sm">{persona.name}</div>
          )}
          {isFieldVisible('age') && persona.age && (
            <div className="text-xs text-gray-500">{persona.age} years old</div>
          )}
        </div>
      </div>

      {/* Quote */}
      {isFieldVisible('quote') && persona.quote && (
        <div className="bg-gray-50 p-2 rounded border-l-2 border-l-gray-300">
          <div className="flex items-start gap-2">
            <Quote className="h-3 w-3 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs italic text-gray-700 line-clamp-2">
              "{persona.quote}"
            </p>
          </div>
        </div>
      )}

      {/* Demographics */}
      <div className="space-y-1 text-xs">
        {isFieldVisible('location') && persona.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-gray-500" />
            <span className="text-gray-700 truncate">{persona.location}</span>
          </div>
        )}

        {isFieldVisible('education') && persona.education && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3 w-3 text-gray-500" />
            <span className="text-gray-700 truncate">{persona.education}</span>
          </div>
        )}

        {isFieldVisible('incomePerMonth') && persona.incomePerMonth && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3 text-gray-500" />
            <span className="text-gray-700 truncate">{persona.incomePerMonth}</span>
          </div>
        )}
      </div>

      {/* Pain Points Preview */}
      {isFieldVisible('painPoints') && persona.painPoints && persona.painPoints.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Tag className="h-3 w-3 text-red-500" />
            <span className="text-xs font-medium text-gray-700">Pain Points</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {persona.painPoints.slice(0, 2).map((point, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-red-50 text-red-700 border-red-200"
              >
                {point.length > 15 ? `${point.substring(0, 15)}...` : point}
              </Badge>
            ))}
            {persona.painPoints.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{persona.painPoints.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Channels Preview */}
      {isFieldVisible('channels') && persona.channels && persona.channels.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Tag className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-medium text-gray-700">Channels</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {persona.channels.slice(0, 2).map((channel, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                {channel}
              </Badge>
            ))}
            {persona.channels.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{persona.channels.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PersonaKanban({ personas, onPersonaClick, onPersonaMove, visibleFields }: PersonaKanbanProps) {
  // Transform personas to kanban items and extract unique segments
  const { kanbanData, columns } = useMemo(() => {
    const segmentMap = new Map<string, SegmentKanbanColumn>();

    // Create kanban items and collect unique segments
    const kanbanItems: PersonaKanbanItem[] = personas.map(persona => {
      const segmentId = persona.segment.id;
      const segmentName = persona.segment.name;

      // Add segment to map if not exists
      if (!segmentMap.has(segmentId)) {
        segmentMap.set(segmentId, {
          id: segmentId,
          name: segmentName,
        });
      }

      return {
        id: persona.id,
        name: persona.name,
        column: segmentId,
        persona,
      };
    });

    return {
      kanbanData: kanbanItems,
      columns: Array.from(segmentMap.values()),
    };
  }, [personas]);

  const [data, setData] = useState<PersonaKanbanItem[]>(kanbanData);

  // Update data when personas prop changes
  React.useEffect(() => {
    setData(kanbanData);
  }, [kanbanData]);

  const handleDataChange = (newData: PersonaKanbanItem[]) => {
    setData(newData);

    // Find moved personas and notify parent
    newData.forEach((item, index) => {
      const originalItem = kanbanData.find(orig => orig.id === item.id);
      if (originalItem && originalItem.column !== item.column) {
        onPersonaMove?.(item.id, item.column);
      }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // Additional drag end logic if needed
  };

  return (
    <div className="w-full">
      <KanbanProvider
        columns={columns}
        data={data}
        onDataChange={handleDataChange}
        onDragEnd={handleDragEnd}
        className="min-h-[600px]"
      >
        {(column) => (
          <KanbanBoard id={column.id} className="w-80" key={column.id}>
            <KanbanHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="font-semibold">{column.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {data.filter(item => item.column === column.id).length}
              </Badge>
            </KanbanHeader>

            <KanbanCards id={column.id}>
              {(item) => (
                <KanbanCard key={item.id} {...item}>
                  <PersonaKanbanCard
                    persona={(item as PersonaKanbanItem).persona}
                    onPersonaClick={onPersonaClick}
                    visibleFields={visibleFields}
                  />
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
}