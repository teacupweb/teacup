import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDashboardAccessStatus } from '@/lib/api';
import Guard from '../Components/guard';
import DashboardAccessGuard from './dashboard-access-guard';

export async function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await headers()).get('cookie');

  try {
    const accessStatus = await getDashboardAccessStatus(cookie || undefined);

    if (accessStatus.canAccessDashboard) {
      return (
        <>
          <Guard />
          {children}
        </>
      );
    }

    return (
      <DashboardAccessGuard
        hasOrder={accessStatus.hasOrder}
        hasCompletedOrder={accessStatus.hasCompletedOrder}
        hasWebsite={accessStatus.hasWebsite}
      >
        {children}
      </DashboardAccessGuard>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === 'Unauthorized') {
      redirect('/auth/login');
    }
    console.error('Error checking dashboard access:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-pulse text-lg font-medium text-rose-600 mb-2">
            Verifying access...
          </div>
          <p className="text-sm text-muted-foreground">
            Please wait while we verify your credentials
          </p>
        </div>
      </div>
    );
  }
}
