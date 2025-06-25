import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import OrderTable from '@/components/dashboard/order-table';
import { mockOrders } from '@/lib/data';

export default function DashboardPage() {
  // In a real app, you'd fetch this data for the logged-in user.
  const orders = mockOrders;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Order Dashboard</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Sale Link
        </Button>
      </div>
      <OrderTable data={orders} />
    </div>
  );
}
