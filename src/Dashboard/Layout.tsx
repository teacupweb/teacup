import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// @ts-ignore
import { AppSidebar } from '@/components/app-sidebar';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '@/AuthProvider';

export default function Layout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user) {
    navigate('/login');
  }
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
