'use client';

import {
  IconDashboard,
  IconInbox,
  IconCalendar,
  IconChartBar,
  IconSettings,
  IconEdit,
} from '@tabler/icons-react';
import { NavMain } from '@/components/nav-main';

// Navigation data
const navData = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'inboxes',
      url: '/dashboard/inboxes',
      icon: IconInbox,
    },
    {
      title: 'Blogs',
      url: '/dashboard/blogs',
      icon: IconCalendar,
    },
    {
      title: 'Analytics',
      url: '/dashboard/analytics',
      icon: IconChartBar,
    },
    {
      title: 'Request Edit',
      url: '/dashboard/request-edit',
      icon: IconEdit,
    },
  ],
};

export function SidebarNavigation() {
  return (
    <>
      {/* Main Navigation */}
      <NavMain items={navData.navMain} />
    </>
  );
}
