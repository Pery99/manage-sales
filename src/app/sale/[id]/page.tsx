import { mockOrders } from '@/lib/data';
import SaleForm from '@/components/sale-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react';


export default function SalePage({ params }: { params: { id: string } }) {
  // In a real app, this would be a database call.
  // We check for order by `id` here, which is the last part of saleLink
  const order = mockOrders.find((o) => o.id === params.id);

  if (!order || order.status !== 'Created') {
    return (
        <div className="container mx-auto py-20 flex justify-center">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Invalid Link</AlertTitle>
                <AlertDescription>
                    This sale link is either invalid, has expired, or the order has already been placed. Please contact the business owner for a new link.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Complete Your Order</CardTitle>
          <CardDescription>
            Please provide your details below to finalize your purchase. Order ID: {order.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SaleForm orderId={order.id} />
        </CardContent>
      </Card>
    </div>
  );
}
