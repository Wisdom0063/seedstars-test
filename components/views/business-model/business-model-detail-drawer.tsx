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
        } catch (error: any) {
            console.error('Failed to save business model:', error);
            setSaveError(error.message || 'Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    }, [editedBM, hasUnsavedChanges, onSave]);

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
            <div className="space-y-6">

                {/* Business Model Canvas Sections */}
                <div className="space-y-6">
                    <h3 className="font-semibold text-lg">Business Model Canvas</h3>

                    {/* Left Side */}
                    <div className="space-y-6">
                        <h4 className="font-medium text-gray-900">Left Side</h4>

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

                    <Separator />

                    {/* Right Side */}
                    <div className="space-y-6">
                        <h4 className="font-medium text-gray-900">Right Side</h4>

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

                    <Separator />

                    {/* Bottom */}
                    <div className="space-y-6">
                        <h4 className="font-medium text-gray-900">Bottom</h4>

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

                    <Separator />

                    {/* Tags & Notes */}
                    <div className="space-y-6">
                        <ArrayFieldEditor
                            field="tags"
                            label="Tags"
                            icon={Package}
                            placeholder="Add a tag"
                            description="Tags for categorization and filtering"
                        />

                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={editedBM.notes || ''}
                                onChange={(e) => updateField('notes', e.target.value)}
                                onBlur={handleFieldBlur}
                                placeholder="Additional notes about this business model"
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const footer = (
        <div className="space-y-4">
            {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{saveError}</p>
                </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500">
                Changes save when you move to the next field
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
