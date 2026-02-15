"use client";

import { NavUser } from '@/components/nav-user';
import { useAuth } from '@/AuthProvider';

export function SidebarUserSection() {
  const { user } = useAuth();

  // Create user data for NavUser component
  const userData = {
    name:
      typeof user === 'object' && user
        ? user.user_metadata?.name || 'User'
        : 'User',
    email:
      typeof user === 'object' && user
        ? user.email || 'user@example.com'
        : 'user@example.com',
    avatar:
      typeof user === 'object' && user
        ? user.user_metadata?.avatar_url || '/avatars/default.jpg'
        : '/avatars/default.jpg',
  };

  return <NavUser user={userData} />;
}
