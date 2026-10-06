export { cn } from 'cn';

export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
) {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
}
