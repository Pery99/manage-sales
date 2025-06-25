'use client';

import type { Order } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import DailyOrderAccordion from './daily-order-accordion';


interface MonthlyOrderAccordionProps {
  ordersByMonthAndDay: Record<string, Record<string, Order[]>>;
}

export default function MonthlyOrderAccordion({ ordersByMonthAndDay }: MonthlyOrderAccordionProps) {
  const monthKeys = Object.keys(ordersByMonthAndDay);
  const totalOrdersInMonth = (month: string) => 
    Object.values(ordersByMonthAndDay[month]).reduce((sum, orders) => sum + orders.length, 0);

  return (
    <Accordion type="single" collapsible defaultValue={monthKeys[0]} className="w-full">
      {monthKeys.map((month) => (
        <AccordionItem value={month} key={month}>
          <AccordionTrigger className="text-xl font-headline hover:no-underline py-6">
            {month} ({totalOrdersInMonth(month)} orders)
          </AccordionTrigger>
          <AccordionContent>
            <DailyOrderAccordion ordersByDay={ordersByMonthAndDay[month]} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
