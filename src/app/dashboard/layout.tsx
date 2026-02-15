'use client';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthProvider';
import { useEffect } from 'react';
import { SiteHeader } from '@/components/site-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user === 'userNotFound') {
      router.push('/login');
    } else if (user && typeof user !== 'string') {
      const companyId = user.user_metadata?.company_id;
      if (!companyId) {
        router.push('/welcome');
      }
    }
  }, [user, router]);

  return (
        <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
             {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
