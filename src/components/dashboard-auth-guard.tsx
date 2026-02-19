import { redirect } from 'next/navigation';

import { headers } from 'next/headers';
import { getSession } from 'better-auth/api';
import { authClient } from '@/lib/auth-client';
import Guard from '../Components/guard';

export async function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await headers()).get('cookie');
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: { cookie: cookie || '' },
    },
  });
  const user = session?.user;

  return (
    <>
      <Guard />
      {children}
    </>
  );
}
