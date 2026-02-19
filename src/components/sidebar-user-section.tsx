'use client';

import { NavUser } from '@/components/nav-user';
import { useAuth } from '@/AuthProvider';

export function SidebarUserSection() {
  const { user } = useAuth();

  // Create user data for NavUser component
  const userData = {
    name: typeof user === 'object' && user ? user.name || 'User' : 'User',
    email:
      typeof user === 'object' && user
        ? user.email || 'user@example.com'
        : 'user@example.com',
    avatar:
      typeof user === 'object' && user?.image
        ? user.image
        : 'https://imgs.search.brave.com/ewXCCss6ECUHYD0_nioiUOIEs17g77vZFYd_Yj3_bvc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pY29u/LWxpYnJhcnkuY29t/L2ltYWdlcy91c2Vy/LWljb24tanBnL3Vz/ZXItaWNvbi1qcGct/MTEuanBn',
  };

  return <NavUser user={userData} />;
}
