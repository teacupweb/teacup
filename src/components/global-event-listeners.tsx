'use client';

import { useEffect } from 'react';

export default function GlobalEventListeners() {
  useEffect(() => {
    // Only add event listeners on client side
    if (typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      console.error('Global window error caught:', {
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Global unhandled promise rejection caught:', {
        reason: event.reason,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
}
