import { Link } from 'react-router';
import Logo from '@/Components/logo';
import { useAuth } from '@/AuthProvider';

function Navbar() {
  const { user } = useAuth();
  return (
    <div>
      <div className='mx-auto my-5 py-4 px-5 container items-center justify-between bg-rose-50 border border-rose-200 rounded-2xl w-full flex'>
        <div className=''>
          {/* <img src='./Assets/icon.png' className='max-h-10' alt='' /> */}
          <Logo className={'h-[50px] min-w-[200px] px-2 rounded-2xl'} />
        </div>
        <div>
          <ul className='flex gap-5 items-center'>
            <li>
              <Link to='/' className='hover:text-rose-600 transition'>
                Home
              </Link>
            </li>
            <li>
              <Link to='/about' className='hover:text-rose-600 transition'>
                About
              </Link>
            </li>
            <li>
              <Link to='/contact' className='hover:text-rose-600 transition'>
                Contact
              </Link>
            </li>
            <li>Blogs</li>
            <li>
              {user !== 'userNotFound' ? (
                <Link
                  to='/dashboard'
                  className='bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition'
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to='/login'
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
