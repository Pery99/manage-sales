'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { createSaleAction } from '@/app/actions';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required.'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be a positive number.')
  ),
});

const saleItemsSchema = z.object({
  items: z.array(itemSchema).min(1, 'You must add at least one item.'),
});

type SaleItemsFormValues = z.infer<typeof saleItemsSchema>;

interface AddItemsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddItemsDialog({ open, onOpenChange }: AddItemsDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<SaleItemsFormValues>({
    resolver: zodResolver(saleItemsSchema),
    defaultValues: {
      items: [{ name: '', price: 0 }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const onSubmit = (values: SaleItemsFormValues) => {
    if (!user) return;
    
    const totalAmount = values.items.reduce((sum, item) => sum + item.price, 0);

    startTransition(async () => {
      const result = await createSaleAction({ ownerId: user.uid, items: values.items, totalAmount });
      if (result.success && result.orderId) {
          form.reset();
          onOpenChange(false);
          router.push(`/sale/${result.orderId}`);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Sale</DialogTitle>
          <DialogDescription>Add the items for this sale. The customer will see this list before paying.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-[1fr_120px_auto] items-start gap-4">
                            <FormField control={form.control} name={`items.${index}.name`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={index !== 0 ? 'sr-only' : ''}>Item Name</FormLabel>
                                    <FormControl><Input placeholder="E.g., T-Shirt" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name={`items.${index}.price`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={index !== 0 ? 'sr-only' : ''}>Price (NGN)</FormLabel>
                                    <FormControl><Input type="number" placeholder="1000" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="button" variant="ghost" size="icon" className="mt-8" onClick={() => remove(index)} disabled={fields.length <= 1}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove Item</span>
                            </Button>
                        </div>
                    ))}
                </div>

                <Button type="button" variant="outline" onClick={() => append({ name: '', price: 0 })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Another Item
                </Button>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Link
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
