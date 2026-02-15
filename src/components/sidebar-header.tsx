"use client";

import Link from 'next/link';
import Logo from '@/Components/logo';

export function SidebarHeader() {
  return (
    <div className='flex items-center gap-2 p-2'>
      <Link href='/'>
        <Logo className='!size-5' />
        <span className='text-base font-semibold'>Teacup</span>
      </Link>
    </div>
  );
}
