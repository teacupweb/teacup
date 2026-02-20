import { ThemeProvider } from 'next-themes';
import AuthProviderBetterAuth from '@/AuthProvider';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProviderBetterAuth>
        <TooltipProvider>
          {children}
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </AuthProviderBetterAuth>
    </ThemeProvider>
  );
}
