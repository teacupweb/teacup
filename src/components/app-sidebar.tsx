import {
  Calendar,
  Inbox,
  Search,
  Settings,
  BarChart3,
  LayoutDashboard,
  Folder,
  HelpCircle,
  List,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar';

import { Link, useLocation } from 'react-router';
import Logo from '@/Components/logo';
// import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';

// Combined menu items - keeping the original structure but adding new sections
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },

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
    {
      title: 'Lifecycle',
      url: '/Dashboard/Lifecycle',
      icon: List,
      disabled: true,
    },
    {
      title: 'Analytics',
      url: '/Dashboard/Analytics',
      icon: BarChart3,
      disabled: true,
    },
    {
      title: 'Projects',
      url: '/Dashboard/Projects',
      icon: Folder,
      disabled: true,
    },
    {
      title: 'Team',
      url: '/Dashboard/Team',
      icon: Users,
      disabled: true,
    },
  ],

  // Secondary navigation (moved to footer area)
  navSecondary: [
    {
      title: 'Settings',
      url: '/Dashboard/Settings',
      icon: Settings,
    },
    {
      title: 'Get Help',
      url: '/Dashboard/Help',
      icon: HelpCircle,
    },
    {
      title: 'Search',
      url: '/Dashboard/Search',
      icon: Search,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentRoute = useLocation().pathname;

  return (
    <Sidebar
      collapsible='offcanvas'
      className='shadow-xl shadow-pink-200 border-r-white'
      {...props}
    >
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel className='pt-10'>
            <Link to='/'>
              <Logo className='h-[50px] min-w-[200px] px-2' />
            </Link>
          </SidebarGroupLabel>
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

        {/* Documents Section */}
        {/* <SidebarGroup>
    
          <NavDocuments items={data.documents} />
        </SidebarGroup> */}

        {/* Secondary Navigation - moved to auto margin top */}
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

      <SidebarFooter>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {data.user.name}
                  <ChevronUp className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side='top'
                className='w-[--radix-popper-anchor-width]'
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarFooter>
    </Sidebar>
  );
}
