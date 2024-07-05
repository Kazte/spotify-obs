'use client';

import React, { useEffect, useState } from 'react';

import { CurrentlyPlaying } from '@/types/types';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import PlayingAnimation from '@/components/playing-animation';
import useInterval from '@/hooks/useInterval';
import { useSearchParams } from 'next/navigation';

export default function NowPlayingPage() {
  const searchParams = useSearchParams();
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<CurrentlyPlaying | null>(null);

  const [marquee, setMarquee] = useState(false);

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
        artist: data.item.artists.map((artist: any) => artist.name).join(', '),
        album_image: data.item.album.images[0].url,
        current_progress: data.progress_ms,
        duration: data.item.duration_ms
      });

      if (data.item.name.length > 20) {
        setMarquee(true);
      }
    } catch (err) {
      console.log('error:', err);
    }
  }, 1000);

  useEffect(() => {
    document.body.style.background = 'transparent';
  }, []);

  return (
    <div className='flex flex-row gap-4 rounded-md border-[2px] bg-zinc-950/30 border-zinc-700/30 w-full p-1 max-w-[550px] items-center justify-center'>
      <div className='relative aspect-square h-20'>
        {currentlyPlaying ? (
          <Image
            src={currentlyPlaying?.album_image}
            fill={true}
            alt='album image'
            sizes='100% 100%'
            className='drop-shadow-lg rounded-sm object-contain'
          />
        ) : (
          <Image
            src={'/placeholder.png'}
            fill={true}
            alt='album image'
            sizes='100% 100%'
            className='drop-shadow-lg rounded-sm object-contain'
          />
        )}
      </div>

      <div className='flex flex-col justify-center gap-2 w-full overflow-hidden'>
        <div className=''>
          <div className='flex flex-row gap-2 justify-start items-center'>
            <PlayingAnimation />

            {currentlyPlaying ? (
              <h1 className='text-xl font-bold drop-shadow-lg truncate'>
                {currentlyPlaying?.name}
              </h1>
            ) : (
              <h1 className='text-xl font-bold drop-shadow-lg truncate'>
                No currently playing
              </h1>
            )}
          </div>
          {currentlyPlaying ? (
            <p className='text-md font-bold drop-shadow-lg truncate'>
              {currentlyPlaying?.artist}
            </p>
          ) : (
            <p className='text-md font-bold drop-shadow-lg truncate'>
              No artist
            </p>
          )}
        </div>

        <div className='flex flex-row w-full'>
          <div className='flex flex-grow h-2 bg-zinc-700/30 rounded-lg overflow-hidden'>
            {currentlyPlaying && (
              <div
                className='h-2 bg-green-500'
                style={{
                  width: `${Math.round(
                    (currentlyPlaying.current_progress * 100) /
                      currentlyPlaying.duration
                  )}%`
                }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
