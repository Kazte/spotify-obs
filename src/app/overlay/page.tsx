'use client';

import { useEffect, useState } from 'react';

import { CurrentlyPlaying } from '@/types/types';
import Image from 'next/image';
import { useCookies } from 'next-client-cookies';

export default function OverlayPage() {
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<CurrentlyPlaying | null>(null);

  const cookies = useCookies();

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await fetch('/api/currently-playing');
        const data = await response.json();

        if (response.status === 204) {
          setCurrentlyPlaying(null);
          return;
        }

        setCurrentlyPlaying({
          name: data.item.name,
          artist: data.item.artists[0].name,
          album_image: data.item.album.images[0].url
        });
      } catch (err) {
        console.log('error:', err);
      }
    };
    fetchCurrentlyPlaying();
  }, []);

  if (!currentlyPlaying) {
    return <div className='text-xl font-bold'>No currently playing</div>;
  }

  return (
    <>
      <button
        className='bg-green-500 text-white p-4 rounded-lg shadow-lg'
        onClick={async () => {
          try {
            const overlay_url = new URL(
              `${process.env.NEXT_PUBLIC_URL}/now-playing`
            );

            const access_token = cookies.get('access_token');

            overlay_url.searchParams.append('access_token', access_token || '');

            await navigator.clipboard.writeText(overlay_url.toString());
          } catch (err) {
            console.log('error:', err);
          }
        }}
      >
        Copy to Clipboard
      </button>
      <div className='flex flex-row gap-4'>
        <Image
          src={currentlyPlaying?.album_image || ''}
          width={100}
          height={100}
          alt='album image'
        />

        <div>
          <p>{currentlyPlaying?.name}</p>

          <p>{currentlyPlaying?.artist}</p>
        </div>
      </div>
    </>
  );
}
