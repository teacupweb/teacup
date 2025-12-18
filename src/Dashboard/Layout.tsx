import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// @ts-ignore
import { AppSidebar } from '@/components/app-sidebar';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '@/AuthProvider';
import { useEffect } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (user === 'userNotFound') {
      navigate('/login');
      // console.log('from layout');
    } else if (user && typeof user !== 'string') {
      // Check if user has company_id in metadata
      const companyId = user.user_metadata?.company_id;
      if (!companyId) {
        // User doesn't have a company, redirect to welcome page
        navigate('/welcome');
      }
    }
  });
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='px-4 sm:px-6 lg:px-10 w-full bg-background min-h-screen dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] transition-colors duration-300'>
        <div className='block lg:hidden py-4'>
          <SidebarTrigger />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
