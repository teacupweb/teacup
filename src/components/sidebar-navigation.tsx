'use client';

import {
  IconDashboard,
  IconInbox,
  IconCalendar,
  IconChartBar,
  IconSettings,
  IconEdit,
  IconUsers,
  IconCalendarEvent,
  IconMessageStar,
  IconHistory,
  IconCode,
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
      title: 'Leads',
      url: '/dashboard/leads',
      icon: IconUsers,
    },
    {
      title: 'Appointments',
      url: '/dashboard/appointments',
      icon: IconCalendarEvent,
    },
    {
      title: 'Testimonials',
      url: '/dashboard/testimonials',
      icon: IconMessageStar,
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
      title: 'Activity',
      url: '/dashboard/activity',
      icon: IconHistory,
    },
    {
      title: 'Head Tags',
      url: '/dashboard/head-tags',
      icon: IconCode,
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
