'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Users, Target, Tag } from 'lucide-react';
import { ValuePropositionWithRelations } from '@/lib/api/value-proposition';
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
  type DragEndEvent,
} from '@/components/ui/shadcn-io/kanban';

interface ValuePropositionKanbanProps {
  valuePropositions: ValuePropositionWithRelations[];
  onValuePropositionClick?: (valueProposition: ValuePropositionWithRelations) => void;
  onValuePropositionMove?: (valuePropositionId: string, newSegmentId: string) => void;
  visibleFields?: string[];
}

// Transform ValueProposition to KanbanItem format
interface ValuePropositionKanbanItem extends Record<string, unknown> {
  id: string;
  name: string;
  column: string;
  valueProposition: ValuePropositionWithRelations;
}

// Transform CustomerSegment to KanbanColumn format
interface SegmentKanbanColumn extends Record<string, unknown> {
  id: string;
  name: string;
}

// Value Proposition Card Component for Kanban
function ValuePropositionKanbanCard({
  valueProposition,
  onValuePropositionClick,
  visibleFields = []
}: {
  valueProposition: ValuePropositionWithRelations;
  onValuePropositionClick?: (valueProposition: ValuePropositionWithRelations) => void;
  visibleFields?: string[];
}) {
  // Helper function to check if a field should be visible
  const isFieldVisible = (fieldName: string) => {
    return visibleFields.length === 0 || visibleFields.includes(fieldName);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div
      className="space-y-3 cursor-pointer"
      onClick={() => onValuePropositionClick?.(valueProposition)}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div className="flex-1">
          {isFieldVisible('name') && (
            <div className="font-medium text-sm">
              {valueProposition.persona ? `VP for ${valueProposition.persona.name}` : `VP for ${valueProposition.segment.name}`}
            </div>
          )}

        </div>
      </div>



      {/* Persona */}
      {isFieldVisible('persona') && valueProposition.persona && (
        <div className="flex items-center gap-2 text-xs">
          <Users className="h-3 w-3 text-gray-500" />
          <span className="text-gray-700 truncate">{valueProposition.persona.name}</span>
        </div>
      )}

      {/* Value Proposition Statements Preview */}
      {isFieldVisible('valuePropositionStatements') && valueProposition.valuePropositionStatements && valueProposition.valuePropositionStatements.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Target className="h-3 w-3 text-purple-500" />
            <span className="text-xs font-medium text-gray-700">Value Props</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {valueProposition.valuePropositionStatements.slice(0, 2).map((statement, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                title={`${statement.offering}: ${statement.description}`}
              >
                {statement.offering.length > 15 ? `${statement.offering.substring(0, 15)}...` : statement.offering}
              </Badge>
            ))}
            {valueProposition.valuePropositionStatements.length > 2 && (
              <Badge
                variant="outline"
                className="text-xs"
                title={valueProposition.valuePropositionStatements.slice(2).map(s => `${s.offering}: ${s.description}`).join('\n')}
              >
                +{valueProposition.valuePropositionStatements.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Customer Jobs Preview */}
      {isFieldVisible('customerJobs') && valueProposition.customerJobs && valueProposition.customerJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Tag className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-medium text-gray-700">Jobs</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {valueProposition.customerJobs.slice(0, 2).map((job, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                title={job.description}
              >
                {job.title.length > 12 ? `${job.title.substring(0, 12)}...` : job.title}
              </Badge>
            ))}
            {valueProposition.customerJobs.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{valueProposition.customerJobs.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Customer Pains Preview */}
      {isFieldVisible('customerPains') && valueProposition.customerPains && valueProposition.customerPains.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Tag className="h-3 w-3 text-red-500" />
            <span className="text-xs font-medium text-gray-700">Pains</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {valueProposition.customerPains.slice(0, 2).map((pain, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-red-50 text-red-700 border-red-200"
                title={pain.description}
              >
                {pain.title.length > 12 ? `${pain.title.substring(0, 12)}...` : pain.title}
              </Badge>
            ))}
            {valueProposition.customerPains.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{valueProposition.customerPains.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Products/Services Preview */}
      {isFieldVisible('productsServices') && valueProposition.productsServices && valueProposition.productsServices.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Tag className="h-3 w-3 text-green-500" />
            <span className="text-xs font-medium text-gray-700">Products</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {valueProposition.productsServices.slice(0, 2).map((product, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-green-50 text-green-700 border-green-200"
                title={product.description}
              >
                {product.name.length > 12 ? `${product.name.substring(0, 12)}...` : product.name}
              </Badge>
            ))}
            {valueProposition.productsServices.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{valueProposition.productsServices.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ValuePropositionKanban({
  valuePropositions,
  onValuePropositionClick,
  onValuePropositionMove,
  visibleFields
}: ValuePropositionKanbanProps) {
  // Transform value propositions to kanban items and extract unique segments
  const { kanbanData, columns } = useMemo(() => {
    const segmentMap = new Map<string, SegmentKanbanColumn>();

    // Create kanban items and collect unique segments
    const kanbanItems: ValuePropositionKanbanItem[] = valuePropositions.map(valueProposition => {
      const segmentId = valueProposition.segment.id;
      const segmentName = valueProposition.segment.name;

      // Add segment to map if not exists
      if (!segmentMap.has(segmentId)) {
        segmentMap.set(segmentId, {
          id: segmentId,
          name: segmentName,
        });
      }

      return {
        id: valueProposition.id,
        name: valueProposition.persona ? `VP for ${valueProposition.persona.name}` : `VP for ${valueProposition.segment.name}`,
        column: segmentId,
        valueProposition,
      };
    });

    return {
      kanbanData: kanbanItems,
      columns: Array.from(segmentMap.values()),
    };
  }, [valuePropositions]);

  const [data, setData] = useState<ValuePropositionKanbanItem[]>(kanbanData);

  // Update data when valuePropositions prop changes
  React.useEffect(() => {
    setData(kanbanData);
  }, [kanbanData]);

  const handleDataChange = useCallback((newData: ValuePropositionKanbanItem[]) => {
    setData(newData);

    // Find moved value propositions and notify parent
    newData.forEach((item, index) => {
      const originalItem = kanbanData.find(orig => orig.id === item.id);
      if (originalItem && originalItem.column !== item.column) {
        onValuePropositionMove?.(item.id, item.column);
      }
    });
  }, [kanbanData, onValuePropositionMove]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    // Additional drag end logic if needed
  }, []);

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
                  <ValuePropositionKanbanCard
                    valueProposition={(item as ValuePropositionKanbanItem).valueProposition}
                    onValuePropositionClick={onValuePropositionClick}
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
