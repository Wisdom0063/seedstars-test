'use client';

import React, { useState } from 'react';
import { ViewDetailDrawer } from '../../view-manager/view-detail-drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    Users,
    Plus,
    X,
    Handshake,
    Lightbulb,
    Package,
    DollarSign,
    Heart,
    Truck,
    CreditCard,
    Settings,
} from 'lucide-react';
import { BusinessModelWithRelations, UpdateBusinessModelRequest } from '@/lib/api/business-model';

interface BusinessModelDetailDrawerProps {
    businessModel: BusinessModelWithRelations | null;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (businessModel: UpdateBusinessModelRequest) => void;
    onDelete?: (businessModel: BusinessModelWithRelations) => void;
    onRealtimeUpdate?: (businessModel: BusinessModelWithRelations) => void;
}

export function BusinessModelDetailDrawer({
    businessModel,
    isOpen,
    onClose,
    onSave,
    onDelete,
    onRealtimeUpdate,
}: BusinessModelDetailDrawerProps) {
    const [editedBM, setEditedBM] = useState<BusinessModelWithRelations | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

    // Initialize editing state when businessModel changes
    React.useEffect(() => {
        if (businessModel) {
            setEditedBM({ ...businessModel });
            setHasUnsavedChanges(false);
        }
    }, [businessModel]);

    const handleSave = React.useCallback(async () => {
        if (!editedBM || !hasUnsavedChanges || !onSave) return;

        setIsSaving(true);
        setSaveError(null);
        try {
            const updateRequest: UpdateBusinessModelRequest = {
                id: editedBM.id,
                name: editedBM.valuePropositionStatement?.offering,
                description: editedBM.valuePropositionStatement?.description || undefined,
                keyPartners: editedBM.keyPartners,
                keyActivities: editedBM.keyActivities,
                keyResources: editedBM.keyResources,
                customerRelationships: editedBM.customerRelationships,
                channels: editedBM.channels,
                customerSegments: editedBM.customerSegments,
                costStructure: editedBM.costStructure,
                revenueStreams: editedBM.revenueStreams,
                tags: editedBM.tags,
                notes: editedBM.notes || undefined
            };

            await onSave(updateRequest);
            setHasUnsavedChanges(false);
            setLastSaved(new Date());
        } catch (error: any) {
            console.error('Failed to save business model:', error);
            setSaveError(error.message || 'Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    }, [editedBM, hasUnsavedChanges, onSave]);

    // Auto-save functionality
    const scheduleAutoSave = React.useCallback(() => {
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
        }

        const timer = setTimeout(() => {
            handleSave();
        }, 2000); // Auto-save after 2 seconds of inactivity

        setAutoSaveTimer(timer);
    }, [autoSaveTimer, handleSave]);

    // Cleanup timer on unmount
    React.useEffect(() => {
        return () => {
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }
        };
    }, [autoSaveTimer]);

    const handleDelete = () => {
        if (businessModel && onDelete) {
            onDelete(businessModel);
        }
        onClose();
    };

    const handleClose = () => {
        if (hasUnsavedChanges) {
            handleSave();
        }
        onClose();
    };

    const updateField = (field: keyof BusinessModelWithRelations, value: any) => {
        if (editedBM) {
            const updatedBM = {
                ...editedBM,
                [field]: value,
            };

            setEditedBM(updatedBM);
            setHasUnsavedChanges(true);
            setSaveError(null);

            if (onRealtimeUpdate) {
                onRealtimeUpdate(updatedBM);
            }

            // Schedule auto-save
            scheduleAutoSave();
        }
    };

    const handleFieldBlur = () => {
        if (hasUnsavedChanges) {
            handleSave();
        }
    };

    // Array field helpers
    const addArrayItem = (field: keyof BusinessModelWithRelations, newItem: string) => {
        if (editedBM && newItem.trim()) {
            const currentArray = (editedBM[field] as string[]) || [];
            updateField(field, [...currentArray, newItem.trim()]);
        }
    };

    const removeArrayItem = (field: keyof BusinessModelWithRelations, index: number) => {
        if (editedBM) {
            const currentArray = (editedBM[field] as string[]) || [];
            const newArray = currentArray.filter((_, i) => i !== index);
            updateField(field, newArray);
        }
    };

    const updateArrayItem = (field: keyof BusinessModelWithRelations, index: number, value: string) => {
        if (editedBM) {
            const currentArray = (editedBM[field] as string[]) || [];
            const newArray = [...currentArray];
            newArray[index] = value;
            updateField(field, newArray);
        }
    };

    // Array field component
    const ArrayFieldEditor = ({
        field,
        label,
        icon: Icon,
        placeholder,
        description
    }: {
        field: keyof BusinessModelWithRelations;
        label: string;
        icon: any;
        placeholder: string;
        description?: string;
    }) => {
        const [newItem, setNewItem] = useState('');
        const items = (editedBM?.[field] as string[]) || [];

        const handleAdd = () => {
            if (newItem.trim()) {
                addArrayItem(field, newItem);
                setNewItem('');
            }
        };

        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <Label className="text-sm font-medium">{label}</Label>
                </div>
                {description && (
                    <p className="text-xs text-gray-500">{description}</p>
                )}

                {/* Existing items */}
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={item}
                                onChange={(e) => updateArrayItem(field, index, e.target.value)}
                                onBlur={handleFieldBlur}
                                className="flex-1"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem(field, index)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Add new item */}
                <div className="flex items-center gap-2">
                    <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAdd();
                            }
                        }}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAdd}
                        className="h-8 w-8 p-0"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };


    const renderEditMode = () => {
        if (!editedBM) return null;

        return (
            <div className="space-y-6 px-2">
                <h3 className="font-semibold text-lg">Business Model Canvas</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="p-4 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-900 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                Left Side
                            </h4>

                            <div className="space-y-6">
                                <ArrayFieldEditor
                                    field="keyPartners"
                                    label="Key Partners"
                                    icon={Handshake}
                                    placeholder="Add a key partner"
                                    description="Who are our key partners and suppliers?"
                                />

                                <ArrayFieldEditor
                                    field="keyActivities"
                                    label="Key Activities"
                                    icon={Lightbulb}
                                    placeholder="Add a key activity"
                                    description="What key activities does our value proposition require?"
                                />

                                <ArrayFieldEditor
                                    field="keyResources"
                                    label="Key Resources"
                                    icon={Settings}
                                    placeholder="Add a key resource"
                                    description="What key resources does our value proposition require?"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 rounded-lg border border-green-200">
                            <h4 className="font-medium text-green-900 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                Right Side
                            </h4>

                            <div className="space-y-6">
                                <ArrayFieldEditor
                                    field="customerRelationships"
                                    label="Customer Relationships"
                                    icon={Heart}
                                    placeholder="Add a customer relationship type"
                                    description="What type of relationship does each customer segment expect?"
                                />

                                <ArrayFieldEditor
                                    field="channels"
                                    label="Channels"
                                    icon={Truck}
                                    placeholder="Add a channel"
                                    description="Through which channels do we want to reach our customer segments?"
                                />

                                <ArrayFieldEditor
                                    field="customerSegments"
                                    label="Customer Segments"
                                    icon={Users}
                                    placeholder="Add a customer segment"
                                    description="For whom are we creating value?"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className=" p-4 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        Financial Structure
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ArrayFieldEditor
                            field="costStructure"
                            label="Cost Structure"
                            icon={CreditCard}
                            placeholder="Add a cost"
                            description="What are the most important costs inherent in our business model?"
                        />

                        <ArrayFieldEditor
                            field="revenueStreams"
                            label="Revenue Streams"
                            icon={DollarSign}
                            placeholder="Add a revenue stream"
                            description="For what value are our customers really willing to pay?"
                        />
                    </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        Additional Information
                    </h4>

                    <div className="space-y-6">
                        <ArrayFieldEditor
                            field="tags"
                            label="Tags"
                            icon={Package}
                            placeholder="Add a tag"
                            description="Tags for categorization and filtering"
                        />

                        <div>
                            <Label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium mb-2">
                                <Settings className="h-4 w-4 text-gray-500" />
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                value={editedBM.notes || ''}
                                onChange={(e) => updateField('notes', e.target.value)}
                                onBlur={handleFieldBlur}
                                placeholder="Additional notes about this business model"
                                rows={4}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getSaveStatus = () => {
        if (isSaving) {
            return { text: "Saving...", color: "text-blue-600" };
        }
        if (hasUnsavedChanges) {
            return { text: "Unsaved changes", color: "text-orange-600" };
        }
        if (lastSaved) {
            const timeAgo = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
            if (timeAgo < 60) {
                return { text: `Saved ${timeAgo}s ago`, color: "text-green-600" };
            } else {
                const minutesAgo = Math.floor(timeAgo / 60);
                return { text: `Saved ${minutesAgo}m ago`, color: "text-green-600" };
            }
        }
        return { text: "Auto-save enabled", color: "text-gray-500" };
    };

    const saveStatus = getSaveStatus();

    const footer = (
        <div className="space-y-4">
            {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{saveError}</p>
                </div>
            )}

            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                    Changes auto-save after 2 seconds
                </span>
                <span className={`flex items-center gap-1 ${saveStatus.color}`}>
                    {isSaving && (
                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {saveStatus.text}
                </span>
            </div>
        </div>
    );

    return (
        <ViewDetailDrawer
            item={businessModel}
            isOpen={isOpen}
            onClose={handleClose}
            title={(bm) => bm.valuePropositionStatement?.offering}
            subtitle={(bm) => bm.valuePropositionStatement?.valueProposition?.segment ?
                `${bm.valuePropositionStatement.valueProposition.segment.name}${bm.valuePropositionStatement.valueProposition.persona ? ` • ${bm.valuePropositionStatement.valueProposition.persona.name}` : ''}` :
                ''}
            description={(bm) => bm.valuePropositionStatement?.description || ''}
            footer={footer}
        >
            {renderEditMode()}
        </ViewDetailDrawer>
    );
}
