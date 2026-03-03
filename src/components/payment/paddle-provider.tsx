'use client';

import { ReactNode, useEffect, useState } from 'react';

interface PaddleProviderProps {
  children: ReactNode;
}

export function PaddleProvider({ children }: PaddleProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Paddle.js script
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      
      // Initialize Paddle
      if (typeof window !== 'undefined' && (window as any).Paddle) {
        (window as any).Paddle.Environment.set(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox');
        (window as any).Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_SIDE_VERIFICATION_TOKEN || '',
          eventCallback: (data: any) => {
            console.log('Paddle event:', data);
          },
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isLoaded) {
    return null;
  }

  return <>{children}</>;
}
