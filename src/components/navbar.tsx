'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Button } from './ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <nav className='flex flex-col md:flex-row justify-center items-center w-full px-6 border-b border-b-zinc-700 md:px-20'>
      <h1 className='text-2xl font-bold text-white md:flex-1 w-full text-center md:text-left'>
        Spotify Widget for OBS
      </h1>
      <div className='flex flex-row gap-2 justify-center md:justify-end p-2'>
        <Button
          asChild
          variant='link'
          className={cn(pathname === '/overlay' && 'active-link')}
        >
          <Link href='/overlay'>Dashboard</Link>
        </Button>
        <Button
          asChild
          variant='link'
          className={cn(pathname === '/about' && 'active-link')}
        >
          <Link href='/about'>About</Link>
        </Button>

        <Button
          variant='link'
          className='text-red-500'
          onClick={async () => {
            try {
              const res = await fetch('/api/logout', {
                method: 'POST'
              });
              if (res.ok) {
                router.push('/');
              }
            } catch (err) {
              console.log('error:', err);
            }
          }}
        >
          Log Out
        </Button>
      </div>
    </nav>
  );
}
