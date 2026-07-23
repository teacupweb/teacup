'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardAccessGuardProps {
  children: React.ReactNode;
  admitStatus: 'true' | 'false' | 'pending';
}

export default function DashboardAccessGuard({
  children,
  admitStatus,
}: DashboardAccessGuardProps) {
  const router = useRouter();

  useEffect(() => {
    // admitStatus === 'true' is the only status that reaches the dashboard;
    // 'false' (never paid) and 'pending' (paid, not yet activated) both send
    // the user to the payment page, which shows the right message for each.
    if (admitStatus !== 'true' && window.location.pathname !== '/payment') {
      router.replace('/payment');
    }
  }, [admitStatus, router]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <div className='text-center'>
        <div className='animate-pulse text-lg font-medium text-rose-600 mb-2'>
          Checking access...
        </div>
        <p className='text-sm text-muted-foreground'>
          Verifying your account status
        </p>
      </div>
    </div>
  );
}
