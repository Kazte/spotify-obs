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
import { themes } from '@/themes/basic-theme';
import { toast } from 'sonner';
import { useCookies } from 'next-client-cookies';
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

  const [options, setOptions] = useState<Options>({
    theme: themes.basic,
    show_album_image: true,
    show_progress_bar: true,
    show_placeholder: true
  });

  const cookies = useCookies();
  const router = useRouter();

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

        if (data.error) {
          if (data.error.status === 401) {
            const res = await fetch('/api/access-token');

            if (res.ok) {
              const response = await fetch('/api/currently-playing');
              const data = await response.json();

              if (response.status === 204) {
                setCurrentlyPlaying(null);
                setAppState(APP_STATE.NO_CONTENT);
                return;
              }

              setCurrentlyPlaying({
                name: data.item.name,
                artist: data.item.artists[0].name,
                album_image: data.item.album.images[0].url,
                current_progress: data.progress_ms,
                duration: data.item.duration
              });

              setAppState(APP_STATE.SUCCESS);
              return;
            } else {
              setAppState(APP_STATE.ERROR);
              return;
            }
          } else {
            setAppState(APP_STATE.ERROR);
            return;
          }
        }

        setCurrentlyPlaying({
          name: data.item.name,
          artist: data.item.artists[0].name,
          album_image: data.item.album.images[0].url,
          current_progress: data.progress_ms,
          duration: data.item.duration
        });

        setAppState(APP_STATE.SUCCESS);
      } catch (err) {
        console.log('error trying fetch:', err);
        setAppState(APP_STATE.ERROR);
      }
    };
    fetchCurrentlyPlaying();
  }, []);

  const handleThemeChange = (value: string) => {
    switch (value) {
      case 'basic':
        setOptions((prev) => {
          return {
            ...prev,
            theme: themes.basic
          };
        });
        break;

      case 'dracula':
        setOptions((prev) => {
          return {
            ...prev,
            theme: themes.dracula
          };
        });
        break;

      case 'solarized_light':
        setOptions((prev) => {
          return {
            ...prev,
            theme: themes.solarized_light
          };
        });
        break;
      case 'solarized_dark':
        setOptions((prev) => {
          return {
            ...prev,
            theme: themes.solarized_dark
          };
        });
        break;
      case 'spotify':
        setOptions((prev) => {
          return {
            ...prev,
            theme: themes.spotify
          };
        });
        break;

      default:
        break;
    }
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
                  <Select onValueChange={handleThemeChange}>
                    <SelectTrigger className='md:w-[280px] w-full'>
                      <SelectValue placeholder='Select theme' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='basic'>Basic</SelectItem>
                        <SelectItem value='dracula'>Dracula</SelectItem>
                        <SelectItem value='solarized_light'>
                          Solarized Light
                        </SelectItem>
                        <SelectItem value='solarized_dark'>
                          Solarized Dark
                        </SelectItem>
                        <SelectItem value='spotify'>Spotify</SelectItem>
                      </SelectGroup>
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
                      setOptions((prev) => {
                        return {
                          ...prev,
                          show_album_image: set
                        };
                      });
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
                      setOptions((prev) => {
                        return {
                          ...prev,
                          show_progress_bar: set
                        };
                      });
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
                      setOptions((prev) => {
                        return {
                          ...prev,
                          show_placeholder: set
                        };
                      });
                    }}
                  />
                </div>
              </div>
              <Button
                className='w-full'
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
                    console.log('error:', err);
                  }
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
            <div className='flex-grow flex justify-center items-start'>
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
                        duration: 0
                      }}
                      options={options}
                    />
                    <p className='text-white'>
                      No currently playing but you can still copy the overlay
                      link and change the options
                    </p>
                    {!options.show_placeholder && (
                      <p className='text-white'>
                        Placeholder is disabled, this is only to show the widget
                      </p>
                    )}
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
            </div>
          </section>
        </Switch.Case>
      </Switch>
    </Loader>
  );
}
