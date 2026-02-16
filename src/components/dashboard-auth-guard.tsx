"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthProvider';
import { useEffect } from 'react';

export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}
