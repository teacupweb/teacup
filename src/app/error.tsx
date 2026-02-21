'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console
    console.error('Application Error caught by error boundary:', error);
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center min-h-[400px] p-6 text-center'>
      <div className='bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-200 dark:border-red-800 max-w-md w-full'>
        <div className='w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-4'>
          <svg
            className='w-8 h-8'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
        </div>
        <h2 className='text-2xl font-bold text-foreground mb-2'>Something went wrong!</h2>
        <p className='text-muted-foreground mb-6'>
          An unexpected error occurred in this section of the application.
        </p>
        <div className='flex flex-col gap-3'>
          <button
            onClick={() => reset()}
            className='w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all'
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className='w-full bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 px-6 rounded-xl transition-all'
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}
