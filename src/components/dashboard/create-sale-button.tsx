'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddItemsDialog from './add-items-dialog';

export default function CreateSaleButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="w-full md:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Sale Link
      </Button>
      <AddItemsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
