'use client';

import { CurrentlyPlaying, Options, Theme } from '@/types/types';
import React, { useEffect, useState } from 'react';

import PlayingWidget from '@/components/playing-widget';
import { themes } from '@/themes/basic-theme';
import useInterval from '@/hooks/useInterval';
import { useSearchParams } from 'next/navigation';

export default function NowPlayingPage() {
  const searchParams = useSearchParams();
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<CurrentlyPlaying | null>(null);

  const [options, setOptions] = useState<Options>();

  useInterval(async () => {
    try {
      const response = await fetch('/api/currently-playing', {
        headers: {
          access_token: searchParams.get('access_token') as string
        }
      });

      if (response.status === 204) {
        setCurrentlyPlaying(null);
        return;
      }

      const data = await response.json();

      if (data.error === 'unauthorized') {
        const res = await fetch('/api/access-token');
        if (res.ok) {
          const response = await fetch('/api/currently-playing');
          if (response.status === 204) {
            setCurrentlyPlaying(null);
            return;
          }

          const data = await response.json();

          setCurrentlyPlaying({
            name: data.item.name,
            artist: data.item.artists[0].name,
            album_image: data.item.album.images[0].url,
            current_progress: data.progress_ms,
            duration: data.item.duration,
            is_playing: data.is_playing
          });
          return;
        }
      }

      setCurrentlyPlaying({
        name: data.item.name,
        artist: data.item.artists.map((artist: any) => artist.name).join(', '),
        album_image: data.item.album.images[0].url,
        current_progress: data.progress_ms,
        duration: data.item.duration_ms,
        is_playing: data.is_playing
      });
    } catch (err) {
      console.log('error:', err);
    }
  }, 1000);

  useEffect(() => {
    if (searchParams.get('theme')) {
      const decodedTheme = atob(searchParams.get('theme') as string);

      setOptions(JSON.parse(decodedTheme));
    }
  }, [searchParams]);

  if (!options) {
    return null;
  }

  return (
    <>
      {currentlyPlaying && currentlyPlaying.is_playing ? (
        <PlayingWidget currentlyPlaying={currentlyPlaying} options={options} />
      ) : (
        <>
          {options.show_placeholder && (
            <PlayingWidget
              currentlyPlaying={{
                name: 'No currently playing',
                artist: 'No artist',
                album_image: '/placeholder.png',
                current_progress: 1,
                duration: 1,
                is_playing: false
              }}
              options={options}
            />
          )}
        </>
      )}
    </>
  );
}
