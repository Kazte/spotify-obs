export type CurrentlyPlaying = {
  name: string;
  artist: string;
  album_image: string;
  current_progress: number;
  duration: number;
  is_playing: boolean;
};

export type Theme = {
  name: string;
  text_color: string;
  background_color: string;
  border_color: string;
};

export type Options = {
  theme: Theme;
  show_album_image: boolean;
  show_progress_bar: boolean;
  custom_themes_urls?: string[];
};
