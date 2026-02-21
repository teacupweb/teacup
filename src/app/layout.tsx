import type { Metadata } from 'next';
import { Outfit, Ubuntu } from 'next/font/google';
import '@/index.css';
import Providers from './providers';
import GlobalEventListeners from '@/components/global-event-listeners';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
});

export const metadata: Metadata = {
  title: 'Teacup - Easy use Tech',
  description: 'Teacup is a 100% no-code SaaS for retail, ecommerce, and service businesses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${outfit.variable} ${ubuntu.variable} antialiased`}>
        <GlobalEventListeners />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
