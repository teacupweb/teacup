'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardAccessGuardProps {
  children: React.ReactNode;
  hasOrder: boolean;
  hasCompletedOrder: boolean;
  hasWebsite: boolean;
}

export default function DashboardAccessGuard({
  children,
  hasOrder,
  hasCompletedOrder,
  hasWebsite,
}: DashboardAccessGuardProps) {
  const router = useRouter();

  useEffect(() => {
    // Guard logic:
    // 1. If no order -> redirect to pricing
    // 2. If has order but not completed -> redirect to order-site
    // 3. If has completed order but no website -> redirect to order-site
    // 4. If has everything -> allow access

    const currentPath = window.location.pathname;

    if (!hasOrder) {
      // No order found, redirect to pricing
      if (currentPath !== '/pricing') {
        router.replace('/pricing');
      }
      return;
    }

    if (!hasCompletedOrder || !hasWebsite) {
      // Has order but not completed OR no website, redirect to create order/site
      if (currentPath !== '/order-site') {
        router.replace('/order-site');
      }
      return;
    }
  }, [hasOrder, hasCompletedOrder, hasWebsite, router]);

  // Show loading state while redirect decision is being made
  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <div className='text-center'>
        <div className='animate-pulse text-lg font-medium text-rose-600 mb-2'>
          Checking access...
        </div>
        <p className='text-sm text-muted-foreground'>
          Verifying your order and website status
        </p>
      </div>
    </div>
  );
}
