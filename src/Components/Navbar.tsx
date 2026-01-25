'use client';
import Link from 'next/link';
import Logo from '@/Components/logo';
import { useAuth } from '@/AuthProvider';

function Navbar() {
  const { user } = useAuth();
  return (
    <div>
      <div className='mx-auto my-5 py-4 px-5 container items-center justify-between bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-800 rounded-2xl w-full flex'>
        <div className=''>
          {/* <img src='./Assets/icon.png' className='max-h-10' alt='' /> */}
          <Logo className={'h-[50px] min-w-[200px]'} />
        </div>
        <div>
          <ul className='flex gap-5 items-center dark:text-gray-200'>
            <li>
              <Link href='/' className='hover:text-rose-600 transition'>
                Home
              </Link>
            </li>
            <li>
              <Link href='/about' className='hover:text-rose-600 transition'>
                About
              </Link>
            </li>
            <li>
              <Link href='/contact' className='hover:text-rose-600 transition'>
                Contact
              </Link>
            </li>
            <li>
              <Link href='/blogs' className='hover:text-rose-600 transition'>
                Blogs
              </Link>
            </li>
            <li>
              <Link href='/pricing' className='hover:text-rose-600 transition'>
                Pricing
              </Link>
            </li>
            <li>
              {user !== 'userNotFound' ? (
                <Link
                  href='/dashboard'
                  className='bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition'
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href='/login'
                  className='bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition'
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
