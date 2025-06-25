'use client';

import type { Order, OrderStatus } from '@/types';
import { useTransition } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Copy, Trash2 } from 'lucide-react';
import { updateOrderStatusAction, cancelOrderAction } from '@/app/actions';

interface OrderActionsProps {
  order: Order;
}

export default function OrderActions({ order }: OrderActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (status: OrderStatus) => {
    if (isPending) return;
    startTransition(async () => {
      await updateOrderStatusAction(order.id, status);
    });
  };

  const handleCancel = () => {
    if (isPending) return;
    if (confirm('Are you sure you want to cancel this order?')) {
      startTransition(async () => {
        await cancelOrderAction(order.id);
      });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here for better UX
  }

  const saleLink = `${window.location.origin}/sale/${order.id}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => copyToClipboard(saleLink)}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Sale Link
        </DropdownMenuItem>
        
        {order.status !== 'Created' && order.trackingId && (
            <DropdownMenuItem onClick={() => copyToClipboard(`${window.location.origin}/track/${order.trackingId}`)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Tracking Link
            </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        {['Pending', 'Processing', 'Shipped', 'Delivered'].map(status => (
             order.status !== status && order.status !== 'Canceled' && order.status !== 'Created' && (
                <DropdownMenuItem key={status} onClick={() => handleStatusUpdate(status as OrderStatus)}>
                    Set to {status}
                </DropdownMenuItem>
            )
        ))}
        
        <DropdownMenuSeparator />
        
        {order.status !== 'Canceled' && (
          <DropdownMenuItem className="text-destructive" onClick={handleCancel}>
            <Trash2 className="mr-2 h-4 w-4" />
            Cancel Order
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
