import OrderTracker from '@/components/order-tracker';
import { getOrderByTrackingId } from '@/services/orderService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, PartyPopper } from 'lucide-react';
import { Suspense } from 'react';

function SuccessMessage() {
    return (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800 [&>svg]:text-green-600">
            <PartyPopper className="h-4 w-4" />
            <AlertTitle>Order Submitted!</AlertTitle>
            <AlertDescription>
                Your order details have been sent to the seller. You can bookmark this page to track its status.
            </AlertDescription>
        </Alert>
    )
}

export default async function TrackPage({ params, searchParams }: { params: { id: string }, searchParams: { new?: string } }) {
  const order = await getOrderByTrackingId(params.id);
  const isNew = searchParams.new === 'true';

  if (!order) {
    return (
        <div className="container mx-auto py-20 flex justify-center">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Invalid Tracking ID</AlertTitle>
                <AlertDescription>
                    This tracking link is invalid. Please check the link or contact the seller.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Order Status</CardTitle>
          <CardDescription>
            Tracking for Order ID: {order.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={null}>
                {isNew && <SuccessMessage />}
            </Suspense>
            <OrderTracker currentStatus={order.status} />
        </CardContent>
      </Card>
    </div>
  );
}
