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
    }
  });
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='px-10 w-full bg-slate-50/50 min-h-screen bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]'>
        <div className='block lg:hidden'>
          <SidebarTrigger />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
