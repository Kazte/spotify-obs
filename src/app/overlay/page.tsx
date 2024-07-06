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
import {
  basic_theme,
  dracula_theme,
  solarized_dark_theme,
  solarized_light_theme
} from '@/themes/basic-theme';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import PlayingWidget from '@/components/playing-widget';
import { toast } from 'sonner';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';

export default function OverlayPage() {
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<CurrentlyPlaying | null>(null);

  const [options, setOptions] = useState<Options>({
    theme: basic_theme,
    show_album_image: true,
    show_progress_bar: true
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
        const data = await response.json();

        if (response.status === 204) {
          setCurrentlyPlaying(null);
          return;
        }

        if (data.error) {
          if (data.error.status === 401) {
            const res = await fetch('/api/access-token');

            if (res.ok) {
              const response = await fetch('/api/currently-playing');
              const data = await response.json();

              if (response.status === 204) {
                setCurrentlyPlaying(null);
                return;
              }

              setCurrentlyPlaying({
                name: data.item.name,
                artist: data.item.artists[0].name,
                album_image: data.item.album.images[0].url,
                current_progress: data.progress_ms,
                duration: data.item.duration
              });
            }
          }
        }

        setCurrentlyPlaying({
          name: data.item.name,
          artist: data.item.artists[0].name,
          album_image: data.item.album.images[0].url,
          current_progress: data.progress_ms,
          duration: data.item.duration
        });
      } catch (err) {
        console.log('error trying fetch:', err);
      }
    };
    fetchCurrentlyPlaying();
  }, []);

  const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newOptions: Options;

    switch (e.target.type) {
      case 'checkbox':
        newOptions = {
          ...options,
          [name]: e.target.checked
        };
        break;

      default:
        newOptions = {
          ...options,
          [name]: value
        };
        break;
    }

    setOptions(newOptions);
  };

  const handleThemeChange = (value: string) => {
    switch (value) {
      case 'basic':
        setOptions((prev) => {
          return {
            ...prev,
            theme: basic_theme
          };
        });
        break;

      case 'dracula':
        setOptions((prev) => {
          return {
            ...prev,
            theme: dracula_theme
          };
        });
        break;

      case 'solarized_light':
        setOptions((prev) => {
          return {
            ...prev,
            theme: solarized_light_theme
          };
        });
        break;
      case 'solarized_dark':
        setOptions((prev) => {
          return {
            ...prev,
            theme: solarized_dark_theme
          };
        });
        break;

      default:
        break;
    }
  };

  if (!currentlyPlaying) {
    return <div className='text-xl font-bold'>No currently playing</div>;
  }

  return (
    <main className='min-h-screen max-w-screen  flex flex-col gap-2'>
      <div className='flex flex-row justify-center items-center w-full px-6  border-b border-b-zinc-700'>
        <h1 className='text-4xl font-bold text-white flex-1'>
          Spotify Widget for OBS
        </h1>
        <div className='flex flex-row gap-2 justify-end p-2  self-end place-self-end justify-self-end'>
          <Button
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
          <Button
            variant='destructive'
            onClick={async () => {
              try {
                const res = await fetch('/api/logout', {
                  method: 'POST'
                });
                if (res.ok) {
                  router.push('/');
                }
              } catch (err) {
                console.log('error:', err);
              }
            }}
          >
            Log Out
          </Button>
        </div>
      </div>

      <section className='flex-grow flex flex-row p-4'>
        <div className='flex-grow'>
          <h1 className='text-2xl font-bold text-white mb-4'>Options</h1>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='theme_selector' className='text-lg'>
                Select Theme:
              </label>
              <Select onValueChange={handleThemeChange}>
                <SelectTrigger className='w-[280px]'>
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
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className='flex flex-row gap-2'>
              <label htmlFor='show_album_image' className='text-lg'>
                Show Image:
              </label>
              <input
                name='show_album_image'
                type='checkbox'
                defaultChecked={options.show_album_image}
                onChange={handleOptionsChange}
              />
            </div>

            <div className='flex flex-row gap-2'>
              <label htmlFor='show_progress_bar' className='text-lg'>
                Show Progress:
              </label>
              <input
                name='show_progress_bar'
                type='checkbox'
                defaultChecked={options.show_progress_bar}
                onChange={handleOptionsChange}
              />
            </div>
          </div>
        </div>
        <div className='max-w-[400px]'>
          <PlayingWidget
            currentlyPlaying={currentlyPlaying}
            options={options}
          />
        </div>
      </section>
    </main>
  );
}
