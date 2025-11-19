import { Link } from 'react-router';
import Logo from '@/Components/logo';

function Navbar() {
  return (
    <div>
      <div className='mx-auto my-5 py-4 px-5 container items-center justify-between bg-rose-50 border border-rose-200 rounded-2xl w-full flex'>
        <div className=''>
          {/* <img src='./Assets/icon.png' className='max-h-10' alt='' /> */}
          <Logo className={'h-[50px] min-w-[200px] px-2 rounded-2xl'} />
        </div>
        <div>
          <ul className='flex gap-5 items-center'>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
            <li>Blogs</li>
            <li>
              <Link
                to='/Dashboard'
                className='p-2 px-5 rounded-2xl text-white bg-rose-600'
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
