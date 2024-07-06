import { Hash } from 'crypto';
import { Theme } from '@/types/types';

const basic_theme: Theme = {
  text_color: '#ffffff',
  background_color: '#09090b',
  border_color: '#3f3f46'
};

const dracula_theme: Theme = {
  text_color: '#f8f8f2',
  background_color: '#282a36',
  border_color: '#44475a'
};

const solarized_light_theme: Theme = {
  text_color: '#002b36',
  background_color: '#fdf6e3',
  border_color: '#073642'
};

const solarized_dark_theme: Theme = {
  text_color: '#839496',
  background_color: '#002b36',
  border_color: '#073642'
};

const spotify_theme: Theme = {
  text_color: '#1db954',
  background_color: '#191414',
  border_color: '#191414'
};

export const themes: Record<string, Theme> = {
  basic: basic_theme,
  dracula: dracula_theme,
  solarized_light: solarized_light_theme,
  solarized_dark: solarized_dark_theme,
  spotify: spotify_theme
};

type ThemeName = keyof typeof themes;
