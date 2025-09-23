'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Target, Tag, Package, DollarSign, Lightbulb, Handshake } from 'lucide-react';
import { BusinessModelWithRelations } from '@/lib/api/business-model';
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
  type DragEndEvent,
} from '@/components/ui/shadcn-io/kanban';

interface BusinessModelKanbanProps {
  businessModels: BusinessModelWithRelations[];
  onBusinessModelClick?: (businessModel: BusinessModelWithRelations) => void;
  onBusinessModelMove?: (businessModelId: string, newStatus: string) => void;
  visibleFields?: string[];
}

// Transform BusinessModel to KanbanItem format
interface BusinessModelKanbanItem extends Record<string, unknown> {
  id: string;
  name: string;
  column: string;
  businessModel: BusinessModelWithRelations;
}

// Transform Status to KanbanColumn format
interface StatusKanbanColumn extends Record<string, unknown> {
  id: string;
  name: string;
}

// Business Model Card Component for Kanban
function BusinessModelKanbanCard({
  businessModel,
  onBusinessModelClick,
  visibleFields = []
}: {
  businessModel: BusinessModelWithRelations;
  onBusinessModelClick?: (businessModel: BusinessModelWithRelations) => void;
  visibleFields?: string[];
}) {
  // Helper function to check if a field should be visible
  const isFieldVisible = (fieldName: string) => {
    return visibleFields.length === 0 || visibleFields.includes(fieldName);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div
      className="space-y-3 cursor-pointer"
      onClick={() => onBusinessModelClick?.(businessModel)}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="flex-1">
          {isFieldVisible('name') && (
            <div className="font-medium text-sm">
              {businessModel.name}
            </div>
          )}
          {isFieldVisible('status') && (
            <Badge 
              className={`text-xs mt-1 ${getStatusColor(businessModel.status)}`}
              variant="outline"
            >
              {businessModel.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Description */}
      {isFieldVisible('description') && businessModel.description && (
        <p className="text-xs text-gray-600 line-clamp-2">
          {businessModel.description}
        </p>
      )}

      {/* Segment & Persona */}
      <div className="space-y-1">
        {isFieldVisible('segment') && businessModel.valuePropositionStatement?.valueProposition?.segment && (
          <div className="flex items-center gap-2 text-xs">
            <Users className="h-3 w-3 text-gray-500" />
            <span className="text-gray-700 truncate">
              {businessModel.valuePropositionStatement.valueProposition.segment.name}
            </span>
          </div>
        )}
        {isFieldVisible('persona') && businessModel.valuePropositionStatement?.valueProposition?.persona && (
          <div className="flex items-center gap-2 text-xs">
            <Users className="h-3 w-3 text-blue-500" />
            <span className="text-blue-700 truncate">
              {businessModel.valuePropositionStatement.valueProposition.persona.name}
            </span>
          </div>
        )}
      </div>

      {/* Value Proposition Statement */}
      {isFieldVisible('valuePropositionStatement') && businessModel.valuePropositionStatement && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Target className="h-3 w-3 text-purple-500" />
            <span className="text-xs font-medium text-gray-700">Value Prop</span>
          </div>
          <Badge
            variant="outline"
            className="text-xs bg-purple-50 text-purple-700 border-purple-200"
            title={businessModel.valuePropositionStatement.offering}
          >
            {businessModel.valuePropositionStatement.offering.length > 30 
              ? `${businessModel.valuePropositionStatement.offering.substring(0, 30)}...` 
              : businessModel.valuePropositionStatement.offering}
          </Badge>
        </div>
      )}

      {/* Key Partners Preview */}
      {isFieldVisible('keyPartners') && businessModel.keyPartners && businessModel.keyPartners.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Handshake className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-medium text-gray-700">Partners</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {businessModel.keyPartners.slice(0, 2).map((partner, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                title={partner}
              >
                {partner.length > 15 ? `${partner.substring(0, 15)}...` : partner}
              </Badge>
            ))}
            {businessModel.keyPartners.length > 2 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{businessModel.keyPartners.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Key Activities Preview */}
      {isFieldVisible('keyActivities') && businessModel.keyActivities && businessModel.keyActivities.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Lightbulb className="h-3 w-3 text-orange-500" />
            <span className="text-xs font-medium text-gray-700">Activities</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {businessModel.keyActivities.slice(0, 2).map((activity, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                title={activity}
              >
                {activity.length > 15 ? `${activity.substring(0, 15)}...` : activity}
              </Badge>
            ))}
            {businessModel.keyActivities.length > 2 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{businessModel.keyActivities.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Revenue Streams Preview */}
      {isFieldVisible('revenueStreams') && businessModel.revenueStreams && businessModel.revenueStreams.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="h-3 w-3 text-emerald-500" />
            <span className="text-xs font-medium text-gray-700">Revenue</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {businessModel.revenueStreams.slice(0, 2).map((stream, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                title={stream}
              >
                {stream.length > 15 ? `${stream.substring(0, 15)}...` : stream}
              </Badge>
            ))}
            {businessModel.revenueStreams.length > 2 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{businessModel.revenueStreams.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {isFieldVisible('tags') && businessModel.tags && businessModel.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {businessModel.tags.slice(0, 2).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs"
            >
              {tag}
            </Badge>
          ))}
          {businessModel.tags.length > 2 && (
            <Badge variant="outline" className="text-xs text-gray-500">
              +{businessModel.tags.length - 2}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

export function BusinessModelKanban({
  businessModels,
  onBusinessModelClick,
  onBusinessModelMove,
  visibleFields = []
}: BusinessModelKanbanProps) {
  // Transform business models to kanban items and extract status columns
  const { kanbanData, columns } = useMemo(() => {
    const statusMap = new Map<string, StatusKanbanColumn>();

    // Define default status columns
    const defaultStatuses = [
      { id: 'draft', name: 'Draft' },
      { id: 'active', name: 'Active' },
      { id: 'archived', name: 'Archived' },
    ];

    // Add default statuses to map
    defaultStatuses.forEach(status => {
      statusMap.set(status.id, status);
    });

    // Create kanban items and collect any additional statuses
    const kanbanItems: BusinessModelKanbanItem[] = businessModels.map(businessModel => {
      const status = businessModel.status || 'draft';

      // Add status to map if not exists
      if (!statusMap.has(status)) {
        statusMap.set(status, {
          id: status,
          name: status.charAt(0).toUpperCase() + status.slice(1),
        });
      }

      return {
        id: businessModel.id,
        name: businessModel.name,
        column: status,
        businessModel,
      };
    });

    return {
      kanbanData: kanbanItems,
      columns: Array.from(statusMap.values()),
    };
  }, [businessModels]);

  const [data, setData] = useState<BusinessModelKanbanItem[]>(kanbanData);

  // Update data when businessModels prop changes
  React.useEffect(() => {
    setData(kanbanData);
  }, [kanbanData]);

  const handleDataChange = useCallback((newData: BusinessModelKanbanItem[]) => {
    setData(newData);

    // Find moved business models and notify parent
    newData.forEach((item, index) => {
      const originalItem = kanbanData.find(orig => orig.id === item.id);
      if (originalItem && originalItem.column !== item.column) {
        onBusinessModelMove?.(item.id, item.column);
      }
    });
  }, [kanbanData, onBusinessModelMove]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    // Additional drag end logic if needed
  }, []);

  if (businessModels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Building2 className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No business models found</p>
        <p className="text-sm">Create your first business model to get started</p>
      </div>
    );
  }

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
                <Building2 className="h-4 w-4 text-gray-600" />
                <span className="font-semibold">{column.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {data.filter(item => item.column === column.id).length}
              </Badge>
            </KanbanHeader>

            <KanbanCards id={column.id}>
              {(item) => (
                <KanbanCard key={item.id} {...item}>
                  <BusinessModelKanbanCard
                    businessModel={(item as BusinessModelKanbanItem).businessModel}
                    onBusinessModelClick={onBusinessModelClick}
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
