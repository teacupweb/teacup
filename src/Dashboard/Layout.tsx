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
      <main className='px-10 w-full'>
        <div className='block lg:hidden'>
          <SidebarTrigger />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
