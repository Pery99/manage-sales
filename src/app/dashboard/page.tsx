'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { getOrdersByOwner } from '@/services/orderService';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

import MonthlyOrderAccordion from '@/components/dashboard/monthly-order-accordion';
import CreateSaleButton from '@/components/dashboard/create-sale-button';

const groupOrdersByMonth = (orders: Order[]): Record<string, Order[]> => {
  // Sort orders by date descending before grouping
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return sortedOrders.reduce((acc, order) => {
    const month = format(new Date(order.createdAt), 'MMMM yyyy');
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(order);
    return acc;
  }, {} as Record<string, Order[]>);
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setIsLoadingOrders(true);
      getOrdersByOwner(user.uid)
        .then(setOrders)
        .finally(() => setIsLoadingOrders(false));
    }
  }, [user]);

  const ordersByMonth = useMemo(() => groupOrdersByMonth(orders), [orders]);

  if (authLoading || isLoadingOrders) {
    return (
      <div className="flex items-center justify-center h-screen-minus-header">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Order Dashboard</h1>
        <CreateSaleButton />
      </div>
      {orders.length > 0 ? (
        <MonthlyOrderAccordion ordersByMonth={ordersByMonth} />
      ) : (
        <div className="text-center py-20 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">No orders yet!</h2>
          <p className="text-muted-foreground mt-2">
            Click 'Create Sale Link' to get started.
          </p>
        </div>
      )}
    </div>
  );
}
