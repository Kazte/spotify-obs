'use client';

import { Button } from './ui/button';
import { Clipboard } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  code: string;
}

export default function Code({ code }: Props) {
  const handleOnCopy = () => {
    navigator.clipboard.writeText(code);
    toast('Copied code to clipboard');
  };

  return (
    <div className='relative'>
      <Button
        size={'icon'}
        variant='secondary'
        onClick={handleOnCopy}
        className='absolute top-5 right-5'
      >
        <Clipboard />
      </Button>
      <pre className='bg-container1 text-container1-foreground rounded-md p-4'>
        {code}
      </pre>
    </div>
  );
}
