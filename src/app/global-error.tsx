'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console
    console.error('Global Error caught by root error boundary:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className='flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background'>
          <div className='bg-red-50 dark:bg-red-900/10 p-10 rounded-3xl border border-red-200 dark:border-red-800 max-w-lg w-full'>
            <div className='w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-6'>
              <svg
                className='w-10 h-10'
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
            <h1 className='text-3xl font-bold text-foreground mb-4'>Critical System Error</h1>
            <p className='text-muted-foreground mb-8 text-lg'>
              A critical error occurred that prevented the application from loading correctly.
            </p>
            <div className='flex flex-col gap-4'>
              <button
                onClick={() => reset()}
                className='w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-rose-500/20'
              >
                Attempt Recovery
              </button>
              <button
                onClick={() => window.location.assign('/')}
                className='w-full bg-muted hover:bg-muted/80 text-foreground font-semibold py-4 px-8 rounded-2xl transition-all'
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
