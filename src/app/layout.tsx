import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { CookiesProvider } from 'next-client-cookies/server';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify Obs',
  description: 'A Spotify overlay for OBS'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Toaster position='bottom-center' theme={'dark'} visibleToasts={1} />
        <Analytics />
        <CookiesProvider>
          <ThemeProvider attribute='class' defaultTheme='dark'>
            {children}
          </ThemeProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
