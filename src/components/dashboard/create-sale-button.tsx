'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { createSaleAction } from '@/app/actions';

export default function CreateSaleButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await createSaleAction();
      // Optionally, you can show a success toast here.
      // Revalidation is handled by the server action.
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <PlusCircle className="mr-2 h-4 w-4" />
      )}
      {isPending ? 'Creating...' : 'Create Sale Link'}
    </Button>
  );
}
