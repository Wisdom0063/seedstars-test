import React from 'react';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ 
    title, 
    description, 
    icon: Icon,
    action 
}: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            {Icon && <Icon className="h-12 w-12 mx-auto mb-4 text-gray-400" />}
            <p className="text-gray-500 text-lg font-medium">{title}</p>
            {description && (
                <p className="text-gray-400 text-sm mt-2">{description}</p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
