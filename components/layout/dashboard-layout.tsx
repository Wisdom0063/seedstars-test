'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

// Generate breadcrumbs based on pathname
function generateBreadcrumbs(pathname: string) {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Dashboard', href: '/' }];

    if (segments.length === 0) return breadcrumbs;

    const pathMap: Record<string, string> = {
        'customer-segments': 'Customer Segments',
        'value-propositions': 'Value Propositions',
        'business-models': 'Business Models',
        'settings': 'Settings',
        'help': 'Help & Support',
    };

    segments.forEach((segment, index) => {
        const isLast = index === segments.length - 1;
        const label = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        if (isLast) {
            breadcrumbs.push({ label, href: '/' + segments.slice(0, index + 1).join('/') });
        } else {
            const href = '/' + segments.slice(0, index + 1).join('/');
            breadcrumbs.push({ label, href });
        }
    });

    return breadcrumbs;
}


export const SIDEBAR_WIDTH = "14rem";
export const SIDEBAR_WIDTH_ICON = "3rem";

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const breadcrumbs = generateBreadcrumbs(pathname);

    return (
        <SidebarProvider style={{
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        } as React.CSSProperties}>
            <AppSidebar />
            <SidebarInset>
                {/* Header with breadcrumbs */}
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {breadcrumbs.length > 1 && (
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbs.map((breadcrumb, index) => (
                                        <React.Fragment key={index}>
                                            <BreadcrumbItem className="hidden md:block">
                                                {breadcrumb.href ? (
                                                    <BreadcrumbLink href={breadcrumb.href}>
                                                        {breadcrumb.label}
                                                    </BreadcrumbLink>
                                                ) : (
                                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                                )}
                                            </BreadcrumbItem>
                                            {index < breadcrumbs.length - 1 && (
                                                <BreadcrumbSeparator className="hidden md:block" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        )}
                    </div>
                </header>

                {/* Main content */}
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
