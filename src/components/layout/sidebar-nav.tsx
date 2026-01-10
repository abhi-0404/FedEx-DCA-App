'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BrainCircuit,
  Briefcase,
  Building,
  Home,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useUser } from '@/hooks/use-user';

const navItems = {
  'FedEx Admin': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/cases', label: 'All Cases', icon: Briefcase },
    { href: '/users', label: 'User Management', icon: Users },
    { href: '/dcas', label: 'DCA Management', icon: Building },
  ],
  'FedEx Employee': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/cases', label: 'My Cases', icon: Briefcase },
  ],
  'Agency Admin': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/cases', label: 'Agency Cases', icon: Briefcase },
    { href: '/users', label: 'Team Management', icon: Users },
  ],
  'Agency Employee': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/cases', label: 'My Assigned Cases', icon: Briefcase },
  ],
};

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useUser();

  if (!user) return null;

  const items = navItems[user.role];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <BrainCircuit className="size-8 text-primary" />
          <h2 className="text-xl font-bold tracking-tighter text-sidebar-foreground">
            DebtFlow AI
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  asChild
                  tooltip={item.label}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
