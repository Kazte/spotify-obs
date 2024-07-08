import Footer from '@/components/footer';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'Spotify Obs',
  description: 'A Spotify overlay for OBS'
};

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-grow flex flex-col gap-2 container'>
        {children}
      </main>
      <Footer />
    </main>
  );
}
