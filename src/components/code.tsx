'use client';

import { Button } from './ui/button';
import { Clipboard } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface Props {
  code: string;
}

export default function Code({ code }: Props) {
  const { toast } = useToast();
  const handleOnCopy = () => {
    navigator.clipboard.writeText(code);
    toast({ description: 'Copied code to clipboard' });
  };

  return (
    <div className='relative '>
      <Button
        size={'icon'}
        variant='secondary'
        onClick={handleOnCopy}
        className='absolute md:top-5 md:right-5 top-2 right-2'
      >
        <Clipboard />
      </Button>
      <pre className='overflow-auto bg-container1 text-container1-foreground rounded-md p-4'>
        {code}
      </pre>
    </div>
  );
}
