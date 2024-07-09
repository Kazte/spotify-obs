import { Theme } from '@/types/types';
import { ThemeSchema } from '@/types/schemas';

export async function checkThemeValidation(
  themeUrl: string
): Promise<[Error | null, Theme?]> {
  try {
    const response = await fetch(themeUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch theme');
    }
    const theme = ThemeSchema.parse(await response.json());

    if (!theme) {
      throw new Error('Invalid theme schema');
    }

    return [null, theme];
  } catch (error: any) {
    console.error('Error fetching theme:', error);
    return [error];
  }
}
