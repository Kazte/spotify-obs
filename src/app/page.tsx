'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

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
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 bg-black'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex'>
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
