'use client';

import type { Order } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Copy } from 'lucide-react';
import OrderStatusBadge from '@/components/order-status-badge';
import Link from 'next/link';
import OrderActions from './order-actions';

interface OrderTableProps {
  data: Order[];
}

export default function OrderTable({ data }: OrderTableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="hidden sm:table-cell">Tracking</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                   <Link href={`/dashboard/order/${order.id}`} className="hover:underline" target="_blank">{order.id.substring(0, 8)}...</Link>
                </TableCell>
                <TableCell>{order.customerName || 'N/A'}</TableCell>
                <TableCell className="hidden md:table-cell">{order.deliveryState || 'N/A'}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                    {order.status !== 'Created' && order.trackingId ? (
                        <Link href={`/track/${order.trackingId}`} className="text-primary hover:underline flex items-center gap-1" target="_blank">
                            View
                            <Copy className="h-3 w-3" />
                        </Link>
                    ) : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <OrderActions order={order} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No orders found for this period.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
