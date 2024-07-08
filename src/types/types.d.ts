export type CurrentlyPlaying = {
  name: string;
  artist: string;
  album_image: string;
  current_progress: number;
  duration: number;
};

export type Theme = {
  text_color: string;
  background_color: string;
  border_color: string;
};

export type Options = {
  theme: Theme;
  show_album_image: boolean;
  show_progress_bar: boolean;
  show_placeholder: boolean;
};
