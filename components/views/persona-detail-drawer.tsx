'use client';

import React, { useState } from 'react';
import { ViewDetailDrawer } from '../view-manager/view-detail-drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    Edit,
    Save,
    X,
    User,
    MapPin,
    Calendar,
    Users,
    MessageSquare,
} from 'lucide-react';
import { Persona } from '@/lib/api/customer-segment';

interface PersonaDetailDrawerProps {
    persona: Persona | null;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (persona: Persona) => void;
    onDelete?: (persona: Persona) => void;
}

export function PersonaDetailDrawer({
    persona,
    isOpen,
    onClose,
    onSave,
    onDelete,
}: PersonaDetailDrawerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPersona, setEditedPersona] = useState<Persona | null>(null);

    // Initialize editing state when persona changes
    React.useEffect(() => {
        if (persona) {
            setEditedPersona({ ...persona });
        }
    }, [persona]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedPersona(persona ? { ...persona } : null);
    };

    const handleSave = () => {
        if (editedPersona && onSave) {
            onSave(editedPersona);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedPersona(persona ? { ...persona } : null);
    };

    const handleDelete = () => {
        if (persona && onDelete) {
            onDelete(persona);
        }
        onClose();
    };

    const updateField = (field: keyof Persona, value: any) => {
        if (editedPersona) {
            setEditedPersona({
                ...editedPersona,
                [field]: value,
            });
        }
    };

    const renderViewMode = () => {
        if (!persona) return null;

        return (
            <div className="p-6 space-y-6">
                {/* Basic Info Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold">Basic Information</h3>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Name</Label>
                            <p className="text-sm font-medium mt-1">{persona.name}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Age</Label>
                            <p className="text-sm mt-1">{persona.age}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Gender</Label>
                            <p className="text-sm mt-1">{persona.gender}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Segment</Label>
                            <Badge variant="secondary" className="mt-1">
                                {persona.segment.name}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Location & Background */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold">Location & Background</h3>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Location</Label>
                            <p className="text-sm mt-1">{persona.location}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Education</Label>
                            <p className="text-sm mt-1">{persona.education}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Income Level</Label>
                            <p className="text-sm mt-1">{persona.incomePerMonth}</p>
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold">Insights</h3>
                    </div>
                    <Separator />

                    <div className="space-y-4">
                        {persona.quote && (
                            <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wide">Quote</Label>
                                <blockquote className="text-sm italic border-l-4 border-gray-200 pl-4 mt-1">
                                    "{persona.quote}"
                                </blockquote>
                            </div>
                        )}

                        {persona.description && (
                            <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wide">Description</Label>
                                <p className="text-sm mt-1 whitespace-pre-wrap">{persona.description}</p>
                            </div>
                        )}

                        {persona.painPoints && persona.painPoints.length > 0 && (
                            <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wide">Pain Points</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {persona.painPoints.map((point, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {point}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {persona.channels && persona.channels.length > 0 && (
                            <div>
                                <Label className="text-xs text-gray-500 uppercase tracking-wide">Channels</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {persona.channels.map((channel, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {channel}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold">Metadata</h3>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Created</Label>
                            <p className="mt-1">{new Date(persona.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Updated</Label>
                            <p className="mt-1">{new Date(persona.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEditMode = () => {
        if (!editedPersona) return null;

        return (
            <div className="p-6 space-y-6">
                {/* Basic Info Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Edit Persona</h3>
                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={editedPersona.name}
                                onChange={(e) => updateField('name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={editedPersona.age}
                                onChange={(e) => updateField('age', parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="gender">Gender</Label>
                            <Input
                                id="gender"
                                value={editedPersona.gender}
                                onChange={(e) => updateField('gender', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="segment">Segment</Label>
                            <Input
                                id="segment"
                                value={editedPersona.segment.name}
                                onChange={(e) => updateField('segment', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Location & Background */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={editedPersona.location}
                                onChange={(e) => updateField('location', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="education">Education</Label>
                            <Input
                                id="education"
                                value={editedPersona.education}
                                onChange={(e) => updateField('education', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="income">Income Level</Label>
                            <Input
                                id="income"
                                value={editedPersona.incomePerMonth}
                                onChange={(e) => updateField('incomePerMonth', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="quote">Quote</Label>
                        <Textarea
                            id="quote"
                            value={editedPersona.quote || ''}
                            onChange={(e) => updateField('quote', e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={editedPersona.description || ''}
                            onChange={(e) => updateField('description', e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const footer = (
        <div className="flex justify-between w-full">
            <div>
                {onDelete && !isEditing && (
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        Delete Persona
                    </Button>
                )}
            </div>

            <div className="flex gap-2">
                {isEditing ? (
                    <>
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </>
                ) : (
                    <Button size="sm" onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Persona
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <ViewDetailDrawer
            item={persona}
            isOpen={isOpen}
            onClose={onClose}
            title={(persona) => persona.name}
            subtitle={(persona) => `${persona.age} years old • ${persona.segment.name}`}
            description={persona?.location}
            footer={footer}
        >
            {isEditing ? renderEditMode() : renderViewMode()}
        </ViewDetailDrawer>
    );
}
