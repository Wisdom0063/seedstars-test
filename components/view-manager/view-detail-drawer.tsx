'use client';

import React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Base interface for any item that can be displayed in the drawer
export interface BaseDrawerItem {
    id: string;
    [key: string]: any;
}

// Main drawer props - Generic container
export interface ViewDetailDrawerProps<T extends BaseDrawerItem> {
    item: T | null;
    isOpen: boolean;
    onClose: () => void;
    direction?: 'left' | 'right' | 'top' | 'bottom';
    title?: string | ((item: T) => string);
    subtitle?: string | ((item: T) => string);
    description?: string | ((item: T) => string);
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export function ViewDetailDrawer<T extends BaseDrawerItem>({
    item,
    isOpen,
    onClose,
    direction = 'right',
    title,
    subtitle,
    description,
    children,
    footer,
    className,
}: ViewDetailDrawerProps<T>) {
    if (!item) return null;

    const getTitle = () => {
        if (typeof title === 'function') {
            return title(item);
        }
        return title || `${item.id}`;
    };

    const getSubtitle = () => {
        if (typeof subtitle === 'function') {
            return subtitle(item);
        }
        return subtitle;
    };

    const getDescription = () => {
        if (typeof description === 'function') {
            return description(item);
        }
        return description;
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose} direction={direction}>
            <DrawerContent className={`h-full ${className || ''}`}>
                {/* Header */}
                <DrawerHeader className="border-b">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <DrawerTitle className="text-lg font-semibold truncate">
                                {getTitle()}
                            </DrawerTitle>
                            {getSubtitle() && (
                                <div className="text-sm text-gray-600 mt-1">
                                    {getSubtitle()}
                                </div>
                            )}
                            {getDescription() && (
                                <DrawerDescription className="mt-2">
                                    {getDescription()}
                                </DrawerDescription>
                            )}
                        </div>

                        <DrawerClose asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <X className="h-4 w-4" />
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                {/* Content - Custom content passed as children */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>

                {/* Footer - Custom footer if provided */}
                {footer && (
                    <DrawerFooter className="border-t">
                        {footer}
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
}
