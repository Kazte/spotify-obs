import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export default function Footer({ className }: Props) {
  return (
    <footer
      className={cn(
        'text-center text-gray-500 text-sm border-t border-b-zinc-700 p-4',
        className
      )}
    >
      <p>
        Made by{' '}
        <a
          href='https://www.github.com/kazte'
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary'
        >
          Kazte
        </a>
      </p>
    </footer>
  );
}
