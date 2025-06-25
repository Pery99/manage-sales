'use client';

import type { Order } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import OrderTable from '@/components/dashboard/order-table';

interface MonthlyOrderAccordionProps {
  ordersByMonth: Record<string, Order[]>;
}

export default function MonthlyOrderAccordion({ ordersByMonth }: MonthlyOrderAccordionProps) {
  const monthKeys = Object.keys(ordersByMonth);

  return (
    <Accordion type="single" collapsible defaultValue={monthKeys[0]} className="w-full">
      {monthKeys.map((month) => (
        <AccordionItem value={month} key={month}>
          <AccordionTrigger className="text-lg font-headline hover:no-underline">
            {month} ({ordersByMonth[month].length} orders)
          </AccordionTrigger>
          <AccordionContent>
            <OrderTable data={ordersByMonth[month]} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
