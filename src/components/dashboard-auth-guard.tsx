import { headers } from 'next/headers';
import { authClient } from '@/lib/auth-client';
import { getDashboardAccessStatus } from '@/lib/api';
import Guard from '../Components/guard';
import DashboardAccessGuard from './dashboard-access-guard';

export async function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await headers()).get('cookie');
  
  // Get session to check if user is authenticated
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: { cookie: cookie || '' },
    },
  });
  
  // If no session, let the client-side Guard handle redirect to login
  if (!session?.user) {
    return (
      <>
        <Guard />
        {children}
      </>
    );
  }

  // Get dashboard access status from backend
  try {
    const accessStatus = await getDashboardAccessStatus(cookie || undefined);
    
    // If user can access dashboard, render normally
    if (accessStatus.canAccessDashboard) {
      return (
        <>
          <Guard />
          {children}
        </>
      );
    }

    // Otherwise, show the access guard which will redirect appropriately
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
    console.error('Error checking dashboard access:', error);
    // Fail secure: Don't grant access on error
    // Show loading state while preventing access
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
