'use client';

import { CurrentlyPlaying, Options, Theme } from '@/types/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Loader from '@/components/loader';
import PlayingWidget from '@/components/playing-widget';
import { Switch } from 'ktools-r';
import { Switch as SwitchCompo } from '@/components/ui/switch';
import { capitalizeEveryWord } from '@/lib/capitalize-word';
import { themes } from '@/themes/basic-theme';
import { toast } from 'sonner';
import { useCookies } from 'next-client-cookies';
import useOptions from '@/hooks/useOptions';
import { useRouter } from 'next/navigation';

const APP_STATE = {
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  NO_CONTENT: 'NO_CONTENT'
};

export default function OverlayPage() {
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<CurrentlyPlaying | null>(null);

  const [appState, setAppState] = useState(APP_STATE.LOADING);

  const cookies = useCookies();
  const router = useRouter();
  const [options, setOptions] = useOptions();

  useEffect(() => {
    if (!cookies.get('access_token')) {
      router.push('/');
      return;
    }
  }, [cookies, router]);

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await fetch('/api/currently-playing');

        if (response.status === 204) {
          setCurrentlyPlaying(null);
          setAppState(APP_STATE.NO_CONTENT);
          return;
        }

        const data = await response.json();

        if (data.error === 'unauthorized') {
          const res = await fetch('/api/access-token');

          if (res.ok) {
            const response = await fetch('/api/currently-playing');

            if (response.status === 204) {
              setCurrentlyPlaying(null);
              setAppState(APP_STATE.NO_CONTENT);
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

            setAppState(APP_STATE.SUCCESS);
            return;
          } else {
            setAppState(APP_STATE.ERROR);
            return;
          }
        }
        setAppState(APP_STATE.SUCCESS);

        setCurrentlyPlaying({
          name: data.item.name,
          artist: data.item.artists[0].name,
          album_image: data.item.album.images[0].url,
          current_progress: data.progress_ms,
          duration: data.item.duration,
          is_playing: data.is_playing
        });
      } catch (err) {
        setAppState(APP_STATE.ERROR);
      }
    };
    fetchCurrentlyPlaying();
  }, [router]);

  const handleThemeChange = (value: string) => {
    const newOptions = {
      ...options,
      theme: themes[value as keyof typeof themes]
    };

    setOptions(newOptions);
  };

  return (
    <Loader loaded={appState !== APP_STATE.LOADING} message='Loading...'>
      <Switch>
        <Switch.Case condition={appState === APP_STATE.ERROR}>
          <div className='flex flex-col justify-center items-center w-full h-full flex-grow'>
            <span className='text-2xl font-bold text-white'>
              Error fetching data
            </span>
          </div>
        </Switch.Case>

        <Switch.Case
          condition={
            appState === APP_STATE.SUCCESS || appState === APP_STATE.NO_CONTENT
          }
        >
          <section className='flex-grow h-full flex flex-col lg:flex-row gap-4 justify-between sm:p-4 pt-4'>
            <div className='w-fit'>
              <h1 className='text-2xl font-bold text-white mb-4'>Options</h1>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <label htmlFor='theme_selector' className='text-lg'>
                    Select Theme:
                  </label>
                  <Select
                    onValueChange={handleThemeChange}
                    defaultValue={options.theme.name}
                  >
                    <SelectTrigger className='md:w-[280px] w-full'>
                      <SelectValue placeholder='Select theme' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(themes).map((key) => {
                        return (
                          <SelectItem key={key} value={key}>
                            {capitalizeEveryWord(key.split('_').join(' '))}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex flex-row gap-2 justify-start items-center'>
                  <label htmlFor='show_album_image' className='text-lg'>
                    Show Image:
                  </label>
                  <SwitchCompo
                    name='show_album_image'
                    defaultChecked={options.show_album_image}
                    onCheckedChange={(set) => {
                      const newOptions = {
                        ...options,
                        show_album_image: set
                      };

                      setOptions(newOptions);
                    }}
                  />
                </div>

                <div className='flex flex-row gap-2 justify-start items-center'>
                  <label htmlFor='show_progress_bar' className='text-lg'>
                    Show Progress:
                  </label>
                  <SwitchCompo
                    name='show_progress_bar'
                    defaultChecked={options.show_progress_bar}
                    onCheckedChange={(set) => {
                      const newOptions = {
                        ...options,
                        show_progress_bar: set
                      };

                      setOptions(newOptions);
                    }}
                  />
                </div>

                <div className='flex flex-row gap-2 justify-start items-center'>
                  <label htmlFor='show_placeholder' className='text-lg'>
                    Show Placeholder:
                  </label>
                  <SwitchCompo
                    name='show_placeholder'
                    defaultChecked={options.show_placeholder}
                    onCheckedChange={(set) => {
                      const newOptions = {
                        ...options,
                        show_placeholder: set
                      };
                      setOptions(newOptions);
                    }}
                  />
                </div>
              </div>
              <Button
                className='w-full mt-4'
                onClick={async () => {
                  try {
                    const overlay_url = new URL(
                      `${process.env.NEXT_PUBLIC_URL}/now-playing`
                    );

                    const access_token = cookies.get('access_token');

                    overlay_url.searchParams.append(
                      'access_token',
                      access_token || ''
                    );

                    overlay_url.searchParams.append(
                      'theme',
                      btoa(JSON.stringify(options))
                    );

                    await navigator.clipboard.writeText(overlay_url.toString());

                    toast.success('Copied to clipboard');
                  } catch (err) {
                    toast.error('Error copying to clipboard');
                  }
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
            <div className='flex-grow flex flex-col justify-start items-center'>
              <div className='bg-placeholder-background bg-cover bg-no-repeat bg-center flex justify-center items-center w-full md:w-[550px] h-fit p-10'>
                <Switch>
                  <Switch.Case condition={appState === APP_STATE.NO_CONTENT}>
                    <PlayingWidget
                      className='mx-auto w-[550px]!'
                      currentlyPlaying={{
                        name: 'No currently playing',
                        artist: 'No artist',
                        album_image: '/placeholder.png',
                        current_progress: 50,
                        duration: 0,
                        is_playing: false
                      }}
                      options={options}
                    />
                  </Switch.Case>
                  <Switch.Default>
                    <PlayingWidget
                      className='mx-auto'
                      currentlyPlaying={currentlyPlaying}
                      options={options}
                    />
                  </Switch.Default>
                </Switch>
              </div>
              <p className='text-white w-full md:w-[550px]'>
                No currently playing but you can still copy the overlay link and
                change the options
              </p>
              {!options.show_placeholder && (
                <p className='text-white w-full md:w-[550px]'>
                  Placeholder is disabled, this is only to show the widget
                </p>
              )}
            </div>
          </section>
        </Switch.Case>
      </Switch>
    </Loader>
  );
}
