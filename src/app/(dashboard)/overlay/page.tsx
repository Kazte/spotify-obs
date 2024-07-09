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
import { use, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Loader from '@/components/loader';
import PlayingWidget from '@/components/playing-widget';
import { SelectLabel } from '@radix-ui/react-select';
import { Switch } from 'ktools-r';
import { Switch as SwitchCompo } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { capitalizeEveryWord } from '@/lib/capitalize-word';
import { checkThemeValidation } from '@/lib/check-theme';
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
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);

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

  useEffect(() => {
    if (options.custom_themes_urls && options.custom_themes_urls.length > 0) {
      const themesPromises = options.custom_themes_urls.map((url) =>
        checkThemeValidation(url)
      );

      Promise.all(themesPromises).then((themes) => {
        const newCustomThemes = themes
          .filter(([error]) => !error)
          .map(([, theme]) => theme as Theme);

        setCustomThemes(newCustomThemes);
      });
    }
  }, [options.custom_themes_urls]);

  const handleThemeChange = (value: string) => {
    let newOptions: Options;

    if (Object.keys(themes).includes(value)) {
      newOptions = {
        ...options,
        theme: themes[value as keyof typeof themes]
      };
    } else {
      const customTheme = customThemes.find((theme) => theme.name === value);

      if (!customTheme) {
        return;
      }

      newOptions = {
        ...options,
        theme: customTheme
      };
    }

    setOptions(newOptions);
  };

  const handleCustomThemesChange = async (
    e: React.FocusEvent<HTMLTextAreaElement>
  ) => {
    try {
      const value = e.target.value;

      const urls = value.split('\n').filter((url) => url !== '');

      // clean repeated urls
      const uniqueUrls = urls.filter(
        (url, index) => urls.indexOf(url) === index
      );

      const themesPromises = uniqueUrls.map((url) => checkThemeValidation(url));

      const themes = await Promise.all(themesPromises);

      const newCustomThemes = themes
        .filter(([error]) => !error)
        .map(([, theme]) => theme as Theme);

      setCustomThemes(newCustomThemes);

      const newOptions = {
        ...options,
        custom_themes_urls: uniqueUrls
      };

      setOptions(newOptions);
    } catch (err: any) {
      toast.error(err.message);
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
                  <Label htmlFor='theme_selector' className='text-lg'>
                    Select Theme:
                  </Label>
                  <Select
                    onValueChange={handleThemeChange}
                    defaultValue={options.theme.name}
                  >
                    <SelectTrigger className='md:w-[280px] w-full'>
                      <SelectValue placeholder='Select theme' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Basic Themes</SelectLabel>
                        {Object.keys(themes).map((key) => {
                          return (
                            <SelectItem key={key} value={key}>
                              {capitalizeEveryWord(key.split('_').join(' '))}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                      {customThemes.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Custom Themes</SelectLabel>
                          {customThemes.map((theme, index) => {
                            return (
                              <SelectItem key={index} value={theme.name}>
                                {capitalizeEveryWord(theme.name)}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex flex-row gap-2 justify-start items-center'>
                  <Label htmlFor='show_album_image' className='text-lg'>
                    Show Image:
                  </Label>
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
                  <Label htmlFor='show_progress_bar' className='text-lg'>
                    Show Progress:
                  </Label>
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
              </div>

              <div className='mt-4'>
                <Label htmlFor='custom_themes_urls' className='text-lg'>
                  Custom Themes URLs:
                </Label>
                <Textarea
                  onBlur={handleCustomThemesChange}
                  name='custom_themes_urls'
                  className='resize-none h-24 text-xs overflow-auto whitespace-nowrap p-1'
                  defaultValue={
                    options.custom_themes_urls
                      ? options.custom_themes_urls.join('\n')
                      : ''
                  }
                />
                <p className='text-sm text-muted-foreground'>
                  One link per line <br />
                  Make sure to use direct links to files (raw css)
                </p>
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
            </div>
          </section>
        </Switch.Case>
      </Switch>
    </Loader>
  );
}
