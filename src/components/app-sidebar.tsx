import { Calendar, Inbox, Settings, LayoutDashboard } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from '@/components/ui/sidebar';

import { Link, useLocation } from 'react-router';
import Logo from '@/Components/logo';
// import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';

// Combined menu items - keeping the original structure but adding new sections
const data = {
  // user: {
  //   name: 'shadcn',
  //   email: 'm@example.com',
  //   avatar: '/avatars/shadcn.jpg',
  // },

  // Original main navigation items
  navMain: [
    {
      title: 'Dashboard',
      url: '/Dashboard',
      icon: LayoutDashboard,
      disabled: false,
    },
    {
      title: 'inboxes',
      url: '/Dashboard/inboxes',
      icon: Inbox,
      disabled: false,
    },
    {
      title: 'Blogs',
      url: '/Dashboard/Blogs',
      icon: Calendar,
      disabled: false,
    },
    // {
    //   title: 'Lifecycle',
    //   url: '/Dashboard/Lifecycle',
    //   icon: List,
    //   disabled: true,
    // },
    // {
    //   title: 'Analytics',
    //   url: '/Dashboard/Analytics',
    //   icon: BarChart3,
    //   disabled: true,
    // },
    // {
    //   title: 'Projects',
    //   url: '/Dashboard/Projects',
    //   icon: Folder,
    //   disabled: true,
    // },
    // {
    //   title: 'Team',
    //   url: '/Dashboard/Team',
    //   icon: Users,
    //   disabled: true,
    // },
  ],

  // Secondary navigation (moved to footer area)
  navSecondary: [
    {
      title: 'Settings',
      url: '/Dashboard/Settings',
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentRoute = useLocation().pathname;

  return (
    <Sidebar
      collapsible='offcanvas'
      className='shadow-xl shadow-pink-200 dark:shadow-none border-r border-sidebar-border'
      {...props}
    >
      <SidebarHeader>
        <SidebarGroup>
          <div className='flex items-center justify-between px-4 pt-6 mb-2'>
            <Link to='/' className='flex-1'>
              <Logo className='h-[40px] w-auto' />
            </Link>
          </div>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            {/* @ts-ignore  */}
            <NavMain items={data.navMain} currentRoute={currentRoute} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className='mt-auto'>
          <SidebarGroupContent>
            <NavSecondary
              // @ts-ignore
              items={data.navSecondary}
              currentRoute={currentRoute}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
