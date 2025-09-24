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
    Lightbulb,
    Users,
    Target,
    Calendar,
    Plus,
    X,
    Briefcase,
    AlertTriangle,
    TrendingUp,
    Shield,
    Package,
} from 'lucide-react';
import { ValuePropositionWithRelations, UpdateValuePropositionRequest } from '@/lib/api/value-proposition';

interface ValuePropositionDetailDrawerProps {
    valueProposition: ValuePropositionWithRelations | null;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (valueProposition: UpdateValuePropositionRequest) => void;
    onDelete?: (valueProposition: ValuePropositionWithRelations) => void;
    onRealtimeUpdate?: (valueProposition: ValuePropositionWithRelations) => void;
}

export function ValuePropositionDetailDrawer({
    valueProposition,
    isOpen,
    onClose,
    onSave,
    onDelete,
    onRealtimeUpdate,
}: ValuePropositionDetailDrawerProps) {
    const [editedVP, setEditedVP] = useState<ValuePropositionWithRelations | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Initialize editing state when valueProposition changes
    React.useEffect(() => {
        if (valueProposition) {
            setEditedVP({ ...valueProposition });
            setHasUnsavedChanges(false);
        }
    }, [valueProposition]);

    const handleSave = React.useCallback(async () => {
        if (!editedVP || !hasUnsavedChanges || !onSave) return;

        setIsSaving(true);
        setSaveError(null);
        try {
            const updateRequest: UpdateValuePropositionRequest = {
                id: editedVP.id,
                tags: editedVP.tags,
                customerJobs: editedVP.customerJobs.map(job => ({
                    title: job.title,
                    description: job.description,
                    importance: job.importance,
                    category: job.category,
                })),
                customerPains: editedVP.customerPains.map(pain => ({
                    title: pain.title,
                    description: pain.description,
                    severity: pain.severity,
                    category: pain.category,
                })),
                gainCreators: editedVP.gainCreators.map(gain => ({
                    title: gain.title,
                    description: gain.description,
                    priority: gain.priority,
                    category: gain.category,
                })),
                painRelievers: editedVP.painRelievers.map(reliever => ({
                    title: reliever.title,
                    description: reliever.description,
                    priority: reliever.priority,
                    category: reliever.category,
                })),
                productsServices: editedVP.productsServices.map(product => ({
                    name: product.name,
                    description: product.description,
                    type: product.type,
                    category: product.category,
                    features: product.features,
                })),
                valuePropositionStatements: editedVP.valuePropositionStatements.map(statement => ({
                    offering: statement.offering,
                    description: statement.description
                }))
            };

            await onSave(updateRequest);
            setHasUnsavedChanges(false);
        } catch (error: any) {
            console.error('Failed to save value proposition:', error);
            setSaveError(error.message || 'Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    }, [editedVP, hasUnsavedChanges, onSave]);

    const handleDelete = () => {
        if (valueProposition && onDelete) {
            onDelete(valueProposition);
        }
        onClose();
    };

    const handleClose = () => {
        if (hasUnsavedChanges) {
            handleSave();
        }
        onClose();
    };

    const updateField = (field: keyof ValuePropositionWithRelations, value: any) => {
        if (editedVP) {
            const updatedVP = {
                ...editedVP,
                [field]: value,
            };

            setEditedVP(updatedVP);
            setHasUnsavedChanges(true);
            setSaveError(null);

            if (onRealtimeUpdate) {
                onRealtimeUpdate(updatedVP);
            }
        }
    };

    const handleFieldBlur = () => {
        if (hasUnsavedChanges) {
            handleSave();
        }
    };

    const addListItem = (listField: string, newItem: any) => {
        if (editedVP) {
            const currentList = (editedVP as any)[listField] || [];
            const updatedList = [...currentList, { ...newItem, order: currentList.length }];
            updateField(listField as keyof ValuePropositionWithRelations, updatedList);
        }
    };

    const updateListItem = (listField: string, index: number, updatedItem: any) => {
        if (editedVP) {
            const currentList = [...((editedVP as any)[listField] || [])];
            currentList[index] = { ...currentList[index], ...updatedItem };
            updateField(listField as keyof ValuePropositionWithRelations, currentList);
        }
    };

    const removeListItem = (listField: string, index: number) => {
        if (editedVP) {
            const currentList = [...((editedVP as any)[listField] || [])];
            currentList.splice(index, 1);
            updateField(listField as keyof ValuePropositionWithRelations, currentList);
        }
    };

    const renderEditMode = () => {
        if (!editedVP) return null;

        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Edit Value Proposition</h3>
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

                {/* Basic Info Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-gray-500" />
                        <h4 className="font-semibold">Basic Information</h4>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Persona</Label>
                                <p className="text-gray-900">{editedVP.persona?.name || 'No specific persona'}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Customer Segment</Label>
                                <p className="text-gray-900">{editedVP.segment.name}</p>
                            </div>
                            {editedVP.tags && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Tags</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {editedVP.tags.map((tag: string, index: number) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Value Proposition Statements */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-500" />
                        <h4 className="font-semibold text-blue-600">Value Proposition Statement</h4>
                    </div>

                    <div className="space-y-4">
                        {editedVP.valuePropositionStatements.map((statement, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                                <div>
                                    <Label>Offering</Label>
                                    <Input
                                        value={statement.offering}
                                        onChange={(e) => updateListItem('valuePropositionStatements', index, { offering: e.target.value })}
                                        onBlur={handleFieldBlur}
                                        placeholder="Provide toys"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Label>Description</Label>
                                        <Input
                                            value={statement.description}
                                            onChange={(e) => updateListItem('valuePropositionStatements', index, { description: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            placeholder="Provide toys"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeListItem('valuePropositionStatements', index)}
                                        className="mt-6"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addListItem('valuePropositionStatements', { offering: '', description: '' })}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Value Proposition Statement
                        </Button>
                    </div>
                </div>

                {/* Two Column Layout for Canvas */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Customer Segment Side */}
                    <div className="space-y-6">
                        {/* Customer Jobs */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-blue-500" />
                                <h4 className="font-semibold">Customer Jobs</h4>
                            </div>

                            <div className="space-y-3">
                                {editedVP.customerJobs.map((job, index) => (
                                    <div key={index} className="p-3 border rounded-lg space-y-2">
                                        <div className="flex justify-between items-start">
                                            <Input
                                                value={job.title}
                                                onChange={(e) => updateListItem('customerJobs', index, { title: e.target.value })}
                                                onBlur={handleFieldBlur}
                                                placeholder="Job title"
                                                className="font-medium"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeListItem('customerJobs', index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={job.description}
                                            onChange={(e) => updateListItem('customerJobs', index, { description: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            placeholder="Job description"
                                            rows={2}
                                        />
                                        <select
                                            value={job.importance}
                                            onChange={(e) => updateListItem('customerJobs', index, { importance: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            className="w-full h-8 rounded border px-2 text-sm"
                                        >
                                            <option value="VERY_IMPORTANT">Very Important</option>
                                            <option value="FAIRLY_IMPORTANT">Fairly Important</option>
                                            <option value="NOT_IMPORTANT">Not Important</option>
                                        </select>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addListItem('customerJobs', {
                                        title: '',
                                        description: '',
                                        importance: 'FAIRLY_IMPORTANT',
                                        category: 'FUNCTIONAL'
                                    })}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Customer Job
                                </Button>
                            </div>
                        </div>

                        {/* Customer Pains */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <h4 className="font-semibold">Customer Pains</h4>
                            </div>

                            <div className="space-y-3">
                                {editedVP.customerPains.map((pain, index) => (
                                    <div key={index} className="p-3 border rounded-lg space-y-2">
                                        <div className="flex justify-between items-start">
                                            <Input
                                                value={pain.title}
                                                onChange={(e) => updateListItem('customerPains', index, { title: e.target.value })}
                                                onBlur={handleFieldBlur}
                                                placeholder="Pain title"
                                                className="font-medium"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeListItem('customerPains', index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={pain.description}
                                            onChange={(e) => updateListItem('customerPains', index, { description: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            placeholder="Pain description"
                                            rows={2}
                                        />
                                        <select
                                            value={pain.severity}
                                            onChange={(e) => updateListItem('customerPains', index, { severity: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            className="w-full h-8 rounded border px-2 text-sm"
                                        >
                                            <option value="EXTREME_PAIN">Extreme Pain</option>
                                            <option value="MODERATE_PAIN">Moderate Pain</option>
                                            <option value="LOW_PAIN">Low Pain</option>
                                        </select>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addListItem('customerPains', {
                                        title: '',
                                        description: '',
                                        severity: 'MODERATE_PAIN',
                                        category: 'OBSTACLES'
                                    })}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Customer Pain
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Value Proposition Side */}
                    <div className="space-y-6">
                        {/* Gain Creators */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                <h4 className="font-semibold">Gain Creators</h4>
                            </div>

                            <div className="space-y-3">
                                {editedVP.gainCreators.map((gain, index) => (
                                    <div key={index} className="p-3 border rounded-lg space-y-2">
                                        <div className="flex justify-between items-start">
                                            <Input
                                                value={gain.title}
                                                onChange={(e) => updateListItem('gainCreators', index, { title: e.target.value })}
                                                onBlur={handleFieldBlur}
                                                placeholder="Gain title"
                                                className="font-medium"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeListItem('gainCreators', index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={gain.description}
                                            onChange={(e) => updateListItem('gainCreators', index, { description: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            placeholder="Gain description"
                                            rows={2}
                                        />
                                        <select
                                            value={gain.priority}
                                            onChange={(e) => updateListItem('gainCreators', index, { priority: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            className="w-full h-8 rounded border px-2 text-sm"
                                        >
                                            <option value="VERY_ESSENTIAL">Very Essential</option>
                                            <option value="FAIRLY_ESSENTIAL">Fairly Essential</option>
                                            <option value="NOT_ESSENTIAL">Not Essential</option>
                                        </select>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addListItem('gainCreators', {
                                        title: '',
                                        description: '',
                                        priority: 'FAIRLY_ESSENTIAL',
                                        category: 'REQUIRED_GAINS'
                                    })}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Gain Creator
                                </Button>
                            </div>
                        </div>

                        {/* Pain Relievers */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-orange-500" />
                                <h4 className="font-semibold">Pain Relievers</h4>
                            </div>

                            <div className="space-y-3">
                                {editedVP.painRelievers.map((reliever, index) => (
                                    <div key={index} className="p-3 border rounded-lg space-y-2">
                                        <div className="flex justify-between items-start">
                                            <Input
                                                value={reliever.title}
                                                onChange={(e) => updateListItem('painRelievers', index, { title: e.target.value })}
                                                onBlur={handleFieldBlur}
                                                placeholder="Pain reliever title"
                                                className="font-medium"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeListItem('painRelievers', index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={reliever.description}
                                            onChange={(e) => updateListItem('painRelievers', index, { description: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            placeholder="Pain reliever description"
                                            rows={2}
                                        />
                                        <select
                                            value={reliever.priority}
                                            onChange={(e) => updateListItem('painRelievers', index, { priority: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            className="w-full h-8 rounded border px-2 text-sm"
                                        >
                                            <option value="VERY_ESSENTIAL">Very Essential</option>
                                            <option value="FAIRLY_ESSENTIAL">Fairly Essential</option>
                                            <option value="NOT_ESSENTIAL">Not Essential</option>
                                        </select>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addListItem('painRelievers', {
                                        title: '',
                                        description: '',
                                        priority: 'FAIRLY_ESSENTIAL',
                                        category: 'PAIN_KILLER'
                                    })}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Pain Reliever
                                </Button>
                            </div>
                        </div>

                        {/* Products & Services */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-indigo-500" />
                                <h4 className="font-semibold">Products And Services</h4>
                            </div>

                            <div className="space-y-3">
                                {editedVP.productsServices.map((product, index) => (
                                    <div key={index} className="p-3 border rounded-lg space-y-2">
                                        <div className="flex justify-between items-start">
                                            <Input
                                                value={product.name}
                                                onChange={(e) => updateListItem('productsServices', index, { name: e.target.value })}
                                                onBlur={handleFieldBlur}
                                                placeholder="Product/Service name"
                                                className="font-medium"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeListItem('productsServices', index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={product.description}
                                            onChange={(e) => updateListItem('productsServices', index, { description: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            placeholder="Product/Service description"
                                            rows={2}
                                        />
                                        <select
                                            value={product.type}
                                            onChange={(e) => updateListItem('productsServices', index, { type: e.target.value })}
                                            onBlur={handleFieldBlur}
                                            className="w-full h-8 rounded border px-2 text-sm"
                                        >
                                            <option value="PRODUCT">Product</option>
                                            <option value="SERVICE">Service</option>
                                            <option value="DIGITAL">Digital</option>
                                            <option value="PHYSICAL">Physical</option>
                                        </select>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addListItem('productsServices', {
                                        name: '',
                                        description: '',
                                        type: 'PRODUCT',
                                        category: '',
                                        features: null
                                    })}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Product/Service
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metadata - Read Only */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <h4 className="font-semibold">Metadata</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Created</Label>
                            <p className="mt-1">{new Date(editedVP.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide">Updated</Label>
                            <p className="mt-1">{new Date(editedVP.updatedAt).toLocaleDateString()}</p>
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
            item={valueProposition}
            isOpen={isOpen}
            onClose={handleClose}
            title={(vp) => vp.persona ? `Value Proposition for ${vp.persona.name}` : `Value Proposition for ${vp.segment.name}`}
            subtitle={(vp) => `${vp.segment.name}${vp.persona ? ` • ${vp.persona.name}` : ''}`}
            description={undefined}
            footer={footer}
        >
            {renderEditMode()}
        </ViewDetailDrawer>
    );
}
