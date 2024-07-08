'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '@/components/loader';
import { useCookies } from 'next-client-cookies';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cookies.get('access_token')) {
      router.push('/overlay');
    } else {
      setLoading(false);
    }
  }, [cookies, router]);

  return (
    <main className='flex min-h-dvh flex-col items-center gap-10'>
      <Loader loaded={!loading} message='Loading...'>
        <h1 className='text-4xl font-bold text-white mt-5'>
          Spotify Widget for OBS
        </h1>
        <div className='z-10 max-w-full items-center justify-between font-semibold flex-grow'>
          <Button asChild>
            <a href={auth_url.toString()}>Login with Spotify</a>
          </Button>
        </div>
        <Footer className='w-full self-end' />
      </Loader>
    </main>
  );
}
