'use client';

import { useState, useTransition } from 'react';
import type { Order, OrderStatus } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import OrderTable from '@/components/dashboard/order-table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bulkUpdateOrderStatusAction } from '@/app/actions';
import { Loader2, Send } from 'lucide-react';

interface DailyOrderAccordionProps {
  ordersByDay: Record<string, Order[]>;
}

const UPDATABLE_STATUSES: OrderStatus[] = ['Processing', 'Shipped', 'Delivered'];

export default function DailyOrderAccordion({ ordersByDay }: DailyOrderAccordionProps) {
  const dayKeys = Object.keys(ordersByDay);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(UPDATABLE_STATUSES[0]);
  const [isPending, startTransition] = useTransition();

  const handleBulkUpdate = (orders: Order[]) => {
    const orderIdsToUpdate = orders
      .filter(o => o.status !== 'Canceled' && o.status !== 'Created' && o.status !== selectedStatus)
      .map(o => o.id);

    if (orderIdsToUpdate.length === 0) {
      alert(`All eligible orders are already set to a final state or already have the status "${selectedStatus}".`);
      return;
    }

    startTransition(() => {
      bulkUpdateOrderStatusAction(orderIdsToUpdate, selectedStatus);
    });
  };

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {dayKeys.map((day) => (
        <AccordionItem value={day} key={day} className="border rounded-lg px-4 bg-background">
          <AccordionTrigger className="font-semibold hover:no-underline">
            {day} ({ordersByDay[day].length} orders)
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex items-center justify-end gap-2 p-4 border rounded-md bg-muted/50">
              <p className="text-sm font-medium mr-auto">Daily Actions</p>
              <Select onValueChange={(v) => setSelectedStatus(v as OrderStatus)} defaultValue={selectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {UPDATABLE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={() => handleBulkUpdate(ordersByDay[day])} disabled={isPending}>
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Send className="mr-2 h-4 w-4" />
                )}
                Update All
              </Button>
            </div>
            <OrderTable data={ordersByDay[day]} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
