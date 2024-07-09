import { z } from 'zod';

export const ThemeSchema = z.object({
  name: z.string(),
  text_color: z.string(),
  background_color: z.string(),
  border_color: z.string()
});
