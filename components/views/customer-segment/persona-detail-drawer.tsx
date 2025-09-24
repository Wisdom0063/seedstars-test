'use client';

import React, { useState } from 'react';
import { ViewDetailDrawer } from '../../view-manager/view-detail-drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    User,
    MapPin,
    Calendar,
    MessageSquare,
} from 'lucide-react';
import { Persona } from '@/lib/api/customer-segment';

interface PersonaDetailDrawerProps {
    persona: Persona | null;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (persona: Persona) => void;
    onDelete?: (persona: Persona) => void;
    onRealtimeUpdate?: (persona: Persona) => void;
}

export function PersonaDetailDrawer({
    persona,
    isOpen,
    onClose,
    onSave,
    onDelete,
    onRealtimeUpdate,
}: PersonaDetailDrawerProps) {
    const [editedPersona, setEditedPersona] = useState<Persona | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    React.useEffect(() => {
        if (persona) {
            setEditedPersona({ ...persona });
            setHasUnsavedChanges(false);
        }
    }, [persona]);

    const handleSave = React.useCallback(async () => {
        if (!editedPersona || !hasUnsavedChanges || !onSave) return;

        setIsSaving(true);
        setSaveError(null);
        try {
            await onSave(editedPersona);
            setHasUnsavedChanges(false);
        } catch (error: any) {
            console.error('Failed to save persona:', error);
            setSaveError(error.message || 'Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    }, [editedPersona, hasUnsavedChanges, onSave]);

    const handleDelete = () => {
        if (persona && onDelete) {
            onDelete(persona);
        }
        onClose();
    };

    const handleClose = () => {
        if (hasUnsavedChanges) {
            handleSave();
        }
        onClose();
    };

    const updateField = (field: keyof Persona, value: any) => {
        if (editedPersona) {
            const updatedPersona = {
                ...editedPersona,
                [field]: value,
            };

            setEditedPersona(updatedPersona);
            setHasUnsavedChanges(true);
            setSaveError(null);

            if (onRealtimeUpdate) {
                onRealtimeUpdate(updatedPersona);
            }
        }
    };

    const handleFieldBlur = () => {
        if (hasUnsavedChanges) {
            handleSave();
        }
    };

    const renderEditMode = () => {
        if (!editedPersona) return null;

        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Edit Persona</h3>
                    <div className="flex items-center gap-2">
                        {isSaving && (
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </div>
                        )}
                        {!isSaving && !hasUnsavedChanges && !saveError && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                Saved
                            </div>
                        )}
                        {hasUnsavedChanges && !isSaving && !saveError && (
                            <div className="flex items-center gap-2 text-sm text-orange-600">
                                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                Unsaved changes
                            </div>
                        )}
                        {saveError && (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                {saveError}
                            </div>
                        )}
                    </div>
                </div>
                <Separator />

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <h4 className="font-semibold">Basic Information</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={editedPersona.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                onBlur={handleFieldBlur}
                                placeholder="Enter name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={editedPersona.age}
                                onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                                onBlur={handleFieldBlur}
                                placeholder="Enter age"
                            />
                        </div>
                        <div>
                            <Label htmlFor="gender">Gender</Label>
                            <Input
                                id="gender"
                                value={editedPersona.gender}
                                onChange={(e) => updateField('gender', e.target.value)}
                                onBlur={handleFieldBlur}
                                placeholder="Enter gender"
                            />
                        </div>
                        <div>
                            <Label htmlFor="segment">Segment</Label>
                            <Input
                                id="segment"
                                value={editedPersona.segment.name}
                                onChange={(e) => updateField('segment', { ...editedPersona.segment, name: e.target.value })}
                                onBlur={handleFieldBlur}
                                placeholder="Enter segment"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <h4 className="font-semibold">Location & Background</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={editedPersona.location}
                                onChange={(e) => updateField('location', e.target.value)}
                                onBlur={handleFieldBlur}
                                placeholder="Enter location"
                            />
                        </div>
                        <div>
                            <Label htmlFor="education">Education</Label>
                            <Input
                                id="education"
                                value={editedPersona.education}
                                onChange={(e) => updateField('education', e.target.value)}
                                onBlur={handleFieldBlur}
                                placeholder="Enter education"
                            />
                        </div>
                        <div>
                            <Label htmlFor="income">Income Level</Label>
                            <Input
                                id="income"
                                value={editedPersona.incomePerMonth}
                                onChange={(e) => updateField('incomePerMonth', e.target.value)}
                                onBlur={handleFieldBlur}
                                placeholder="Enter income level"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-gray-500" />
                        <h4 className="font-semibold">Insights</h4>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="quote">Quote</Label>
                            <Textarea
                                id="quote"
                                value={editedPersona.quote || ''}
                                onChange={(e) => updateField('quote', e.target.value)}
                                onBlur={handleFieldBlur}
                                rows={2}
                                placeholder="Enter a representative quote"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editedPersona.description || ''}
                                onChange={(e) => updateField('description', e.target.value)}
                                onBlur={handleFieldBlur}
                                rows={4}
                                placeholder="Enter persona description"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <h4 className="font-semibold">Metadata</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Created</Label>
                            <p className="mt-1">{new Date(editedPersona.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Updated</Label>
                            <p className="mt-1">{new Date(editedPersona.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    const footer = (
        <div className="flex justify-between w-full">

            <div className="flex items-center gap-2 text-sm text-gray-500">
                Changes save when you move to the next field
            </div>
        </div>
    );

    return (
        <ViewDetailDrawer
            item={persona}
            isOpen={isOpen}
            onClose={handleClose}
            title={(persona) => persona.name}
            subtitle={(persona) => `${persona.age} years old • ${persona.segment.name}`}
            description={persona?.location}
            footer={footer}
        >
            {renderEditMode()}
        </ViewDetailDrawer>
    );
}
