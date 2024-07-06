'use client';

import { CurrentlyPlaying, Options, Theme } from '@/types/types';
import React, { useEffect, useState } from 'react';

import PlayingWidget from '@/components/playing-widget';
import { basic_theme } from '@/themes/basic-theme';
import useInterval from '@/hooks/useInterval';
import { useSearchParams } from 'next/navigation';

export default function NowPlayingPage() {
  const searchParams = useSearchParams();
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<CurrentlyPlaying | null>(null);

  const [options, setOptions] = useState<Options>({
    theme: basic_theme,
    show_album_image: true,
    show_progress_bar: true
  });

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

      if (searchParams.get('theme')) {
        const decodedTheme = atob(searchParams.get('theme') as string);

        setOptions(JSON.parse(decodedTheme));
      }

      const data = await response.json();
      setCurrentlyPlaying({
        name: data.item.name,
        artist: data.item.artists.map((artist: any) => artist.name).join(', '),
        album_image: data.item.album.images[0].url,
        current_progress: data.progress_ms,
        duration: data.item.duration_ms
      });
    } catch (err) {
      console.log('error:', err);
    }
  }, 1000);

  useEffect(() => {
    document.body.style.background = 'transparent';
  }, []);

  return (
    <PlayingWidget currentlyPlaying={currentlyPlaying} options={options} />
  );
}
