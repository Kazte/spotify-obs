import { CurrentlyPlaying, Options, Theme } from '@/types/types';

import Image from 'next/image';
import PlayingAnimation from './playing-animation';

interface Props {
  currentlyPlaying: CurrentlyPlaying | null;
  options: Options;
}

export default function PlayingWidget({ currentlyPlaying, options }: Props) {
  if (!Boolean(currentlyPlaying)) {
    return null;
  }

  console.log('options:', options);

  return (
    <div
      className={`flex flex-row gap-4 rounded-md border-[2px] bg-opacity-30 border-opacity-30 w-full p-1 max-w-[550px] items-center justify-center`}
      style={{
        backgroundColor: options.theme.background_color + '80',
        borderColor: options.theme.border_color + '80',
        color: options.theme.text_color
      }}
    >
      {options.show_album_image && (
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
      )}

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

        {options.show_progress_bar && (
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
        )}
      </div>
    </div>
  );
}
