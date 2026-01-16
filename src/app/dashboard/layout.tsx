"use client";

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthProvider';
import { useEffect } from 'react';

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
    <SidebarProvider>
      <AppSidebar />
      <main className='px-4 sm:px-6 lg:px-10 w-full bg-background min-h-screen dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] transition-colors duration-300'>
        <div className='block lg:hidden py-4'>
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
