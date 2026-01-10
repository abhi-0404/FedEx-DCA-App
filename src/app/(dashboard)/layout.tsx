'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useUser } from '@/hooks/use-user';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/');
    }
  }, [user, router]);
  
  if (!user) {
    return (
        <div className="flex h-screen w-full">
            <div className="hidden md:block w-64 bg-muted p-4">
                <Skeleton className="h-10 w-40 mb-8"/>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full"/>
                    <Skeleton className="h-8 w-full"/>
                    <Skeleton className="h-8 w-full"/>
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
                    <div className="flex-1" />
                    <Skeleton className="h-9 w-9 rounded-full"/>
                </header>
                <main className="flex-1 p-6"><Skeleton className="h-full w-full"/></main>
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
