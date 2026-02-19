import { ThemeProvider } from 'next-themes';
import AuthProviderBetterAuth from '@/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProviderBetterAuth>
        <TooltipProvider>
          {children}
          <ToastContainer />
        </TooltipProvider>
      </AuthProviderBetterAuth>
    </ThemeProvider>
  );
}
