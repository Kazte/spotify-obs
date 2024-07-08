import { Options, Theme } from '@/types/types';
import { useEffect, useState } from 'react';

import { themes } from '@/themes/basic-theme';

export default function useOptions() {
  const [options, _setOptions] = useState<Options>({
    theme: themes.basic,
    show_album_image: true,
    show_placeholder: true,
    show_progress_bar: true
  });

  useEffect(() => {
    const options = localStorage.getItem('options');

    if (Boolean(options)) {
      _setOptions(JSON.parse(options!));
    }
  }, []);

  const setOptions = (options: Options) => {
    localStorage.setItem('options', JSON.stringify(options));
    _setOptions(options);
  };

  return [options, setOptions] as const;
}
