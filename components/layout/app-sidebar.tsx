'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  Users,
  Target,
  Building2,
  BarChart3,
  Settings,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Customer Segments',
    icon: Users,
    href: '/customer-segments',
    description: 'Manage customer segments and personas'
  },
  {
    title: 'Value Propositions',
    icon: Target,
    href: '/value-propositions',
    description: 'Define and manage value propositions'
  },
  {
    title: 'Business Models',
    icon: Building2,
    href: '/business-models',
    description: 'Business model canvas and strategies'
  },
];

const secondaryItems = [
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
    description: 'Application settings'
  },
  {
    title: 'Help & Support',
    icon: HelpCircle,
    href: '/help',
    description: 'Get help and support'
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">SeedStars</span>
            <span className="truncate text-xs text-muted-foreground">Business Canvas</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.description}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          <p>© 2024 SeedStars</p>
          <p>Business Canvas Platform</p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
