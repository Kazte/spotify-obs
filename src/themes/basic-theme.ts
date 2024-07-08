import { Theme } from '@/types/types';

const basic_theme: Theme = {
  name: 'basic',
  text_color: '#ffffff',
  background_color: '#09090b',
  border_color: '#3f3f46'
};

const dracula_theme: Theme = {
  name: 'dracula',
  text_color: '#f8f8f2',
  background_color: '#282a36',
  border_color: '#44475a'
};

const solarized_light_theme: Theme = {
  name: 'solarized_light',
  text_color: '#002b36',
  background_color: '#fdf6e3',
  border_color: '#073642'
};

const solarized_dark_theme: Theme = {
  name: 'solarized_dark',
  text_color: '#839496',
  background_color: '#002b36',
  border_color: '#073642'
};

const spotify_theme: Theme = {
  name: 'spotify',
  text_color: '#1db954',
  background_color: '#191414',
  border_color: '#191414'
};

const light_theme: Theme = {
  name: 'light',
  text_color: '#0c0c0c',
  background_color: '#ffffff',
  border_color: '#0c0c0c'
};

const purple_theme: Theme = {
  name: 'purple',
  text_color: '#ffffff',
  background_color: '#4b0082',
  border_color: '#fff'
};

export const themes: { [key: string]: Theme } = {
  basic: basic_theme,
  dracula: dracula_theme,
  solarized_light: solarized_light_theme,
  solarized_dark: solarized_dark_theme,
  spotify: spotify_theme,
  light: light_theme,
  purple: purple_theme
};
