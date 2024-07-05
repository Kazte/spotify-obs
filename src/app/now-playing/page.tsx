'use client';

import React, { useEffect, useState } from 'react';

import { CurrentlyPlaying } from '@/types/types';
import Image from 'next/image';
import PlayingAnimation from '@/components/playing-animation';
import useInterval from '@/hooks/useInterval';
import { useSearchParams } from 'next/navigation';

export default function NowPlayingPage() {
  const searchParams = useSearchParams();
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<CurrentlyPlaying | null>(null);

  useInterval(async () => {
    try {
      const response = await fetch(
        '/api/currently-playing?access_token=' +
          searchParams.get('access_token')
      );

      if (response.status === 204) {
        setCurrentlyPlaying(null);
        return;
      }

      const data = await response.json();

      setCurrentlyPlaying({
        name: data.item.name,
        artist: data.item.artists[0].name,
        album_image: data.item.album.images[0].url
      });
    } catch (err) {
      console.log('error:', err);
    }
  }, 1000);

  console.log('searchParams:', searchParams.get('access_token'));

  useEffect(() => {
    document.body.style.background = 'transparent';
  }, []);

  if (!currentlyPlaying) {
    return <div className='text-xl font-bold'>No content</div>;
  }

  return (
    <div className='flex flex-row gap-4 rounded-md border bg-zinc-950/30 border-zinc-400/20 w-fit p-2 m-2'>
      <Image
        src={currentlyPlaying?.album_image || 'https://placehold.co/100'}
        width={100}
        height={100}
        alt='album image'
        className='drop-shadow-lg rounded-sm'
      />

      <div>
        <PlayingAnimation />
        <p className='text-xl font-bold drop-shadow-lg flex justify-center items-center gap-2'>
          {currentlyPlaying?.name}
        </p>

        <p className='text-lg font-bold drop-shadow-lg'>
          {currentlyPlaying?.artist}
        </p>
      </div>
    </div>
  );
}
