'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/ThemeProvider';
import AuthProviderBetterAuth from '@/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProviderBetterAuth>
          <TooltipProvider>
            {children}
            <ToastContainer />
          </TooltipProvider>
        </AuthProviderBetterAuth>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
