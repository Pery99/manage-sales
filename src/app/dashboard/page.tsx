'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { getOrdersByOwner } from '@/services/orderService';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { nigerianStates } from '@/lib/nigerian-states';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import MonthlyOrderAccordion from '@/components/dashboard/monthly-order-accordion';
import CreateSaleButton from '@/components/dashboard/create-sale-button';

const groupOrdersByMonthAndDay = (orders: Order[]): Record<string, Record<string, Order[]>> => {
  // Sort orders by date descending before grouping
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return sortedOrders.reduce((acc, order) => {
    const month = format(new Date(order.createdAt), 'MMMM yyyy');
    const day = format(new Date(order.createdAt), 'MMMM d, yyyy');
    if (!acc[month]) {
      acc[month] = {};
    }
    if (!acc[month][day]) {
      acc[month][day] = [];
    }
    acc[month][day].push(order);
    return acc;
  }, {} as Record<string, Record<string, Order[]>>);
};


export default function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [filteredState, setFilteredState] = useState<string>('all');

  useEffect(() => {
    if (!authLoading) {
        if (!user) {
            router.push('/login');
        } else if (!userProfile) {
            router.push('/onboarding');
        }
    }
  }, [user, userProfile, authLoading, router]);

  useEffect(() => {
    if (user) {
      setIsLoadingOrders(true);
      getOrdersByOwner(user.uid)
        .then(setAllOrders)
        .finally(() => setIsLoadingOrders(false));
    }
  }, [user]);

  const filteredOrders = useMemo(() => {
    if (filteredState === 'all') {
        return allOrders;
    }
    return allOrders.filter(order => order.deliveryState === filteredState);
  }, [allOrders, filteredState]);

  const ordersByMonthAndDay = useMemo(() => groupOrdersByMonthAndDay(filteredOrders), [filteredOrders]);

  if (authLoading || isLoadingOrders || !userProfile) {
    return (
      <div className="flex items-center justify-center h-screen-minus-header">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Should be redirected, but as a fallback.
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">Order Dashboard</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Select onValueChange={setFilteredState} defaultValue="all">
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {nigerianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                </SelectContent>
            </Select>
            <CreateSaleButton />
        </div>
      </div>
      {filteredOrders.length > 0 ? (
        <MonthlyOrderAccordion ordersByMonthAndDay={ordersByMonthAndDay} />
      ) : (
        <div className="text-center py-20 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold">No orders found!</h2>
          <p className="text-muted-foreground mt-2">
            Click 'Create Sale Link' to get started or adjust your filters.
          </p>
        </div>
      )}
    </div>
  );
}
