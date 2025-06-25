'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { createSaleAction } from '@/app/actions';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function CreateSaleButton() {
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
        // This should ideally not happen if the page is protected
        alert("You must be logged in to create a sale.");
        return;
    }

    startTransition(async () => {
      const result = await createSaleAction(user.uid);
      if (result.success && result.orderId) {
          router.push(`/sale/${result.orderId}`);
      }
      // Revalidation is handled by the server action.
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending || !user}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <PlusCircle className="mr-2 h-4 w-4" />
      )}
      {isPending ? 'Creating...' : 'Create Sale Link'}
    </Button>
  );
}
