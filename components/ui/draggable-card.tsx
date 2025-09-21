'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DraggableCardProps extends React.ComponentProps<typeof Card> {
  id: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function DraggableCard({ 
  id, 
  children, 
  className, 
  disabled = false,
  ...props 
}: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-none select-none',
        isDragging && 'opacity-50 shadow-lg scale-105 z-50',
        !disabled && 'cursor-grab active:cursor-grabbing',
        disabled && 'cursor-default',
        className
      )}
      {...attributes}
      {...listeners}
      {...props}
    >
      {children}
    </Card>
  );
}
