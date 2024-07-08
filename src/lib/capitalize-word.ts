export function capitalizeEveryWord(str: string): string {
  return str.replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
