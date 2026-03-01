import { Link } from 'lucide-react';
import React from 'react';

interface Props {}

function OrderSiteNow(props: Props) {
  const {} = props;

  return (
    <div className='bg-linear-to-r from-rose-500 to-rose-600 rounded-2xl p-6 text-white text-left md:flex items-center justify-between gap-6 shadow-xl shadow-rose-500/20 max-w-3xl mx-auto'>
      <div className='flex items-center gap-4 mb-4 md:mb-0'>
        <div className='bg-white/20 p-3 rounded-xl'>
          <svg
            className='w-8 h-8'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
            />
          </svg>
        </div>
        <div>
          <h2 className='text-2xl font-bold'>Don't have a website yet?</h2>
          <p className='text-rose-50 font-medium'>
            Order one—don't worry, it's free!
          </p>
        </div>
      </div>
      <Link href='/order-site'>
        <button className='bg-white text-rose-600 px-6 py-3 rounded-xl font-bold hover:bg-rose-50 transition-colors whitespace-nowrap'>
          Order Free Site
        </button>
      </Link>
    </div>
  );
}

export default OrderSiteNow;
