'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCookies } from 'next-client-cookies';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const auth_url = new URL('https://accounts.spotify.com/authorize');

auth_url.searchParams.append(
  'client_id',
  process.env.NEXT_PUBLIC_CLIENT_ID as string
);
auth_url.searchParams.append('response_type', 'code');
auth_url.searchParams.append(
  'redirect_uri',
  process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI as string
);
auth_url.searchParams.append('scope', 'user-read-currently-playing');

export default function Home() {
  const cookies = useCookies();
  const router = useRouter();

  useEffect(() => {
    if (cookies.get('access_token')) {
      router.push('/overlay');
    }
  }, [cookies, router]);

  return (
    <main className='flex min-h-screen flex-col items-center gap-10 p-24 bg-black'>
      <h1 className='text-4xl font-bold text-white'>Spotify Widget for OBS</h1>
      <div className='z-10 max-w-full items-center justify-between font-mono text-sm lg:flex'>
        <a
          className='bg-green-500 text-white p-4 rounded-lg shadow-lg'
          href={auth_url.toString()}
        >
          Login with Spotify
        </a>
      </div>
    </main>
  );
}
