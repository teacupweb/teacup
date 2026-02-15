"use client";

import {
  IconDashboard,
  IconInbox,
  IconCalendar,
  IconChartBar,
  IconSettings,
} from '@tabler/icons-react';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';

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
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: IconSettings,
    },
  ],
};

export function SidebarNavigation() {
  return (
    <>
      {/* Main Navigation */}
      <NavMain items={navData.navMain} />

      {/* Secondary Navigation */}
      <NavSecondary items={navData.navSecondary} />
    </>
  );
}
