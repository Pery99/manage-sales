import { getOrder } from '@/services/orderService';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import OrderStatusBadge from '@/components/order-status-badge';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

function DetailRow({ label, value }: { label: string; value: string | React.ReactNode }) {
    if (!value) return null;
    return (
        <div className="grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-sm text-foreground col-span-2 sm:mt-0">{value}</dd>
        </div>
    )
}

const formatCurrency = (amount: number) => {
    // Fallback for environments where Intl might not be fully supported, or for amount being null/undefined.
    if (typeof amount !== 'number') {
        amount = 0;
    }
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-2xl">Order Details</CardTitle>
              <CardDescription>
                Full information for Order ID: {order.id}
              </CardDescription>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </CardHeader>
        <CardContent>
            <Separator className="my-4" />
            <dl className="space-y-4">
                <DetailRow label="Customer Name" value={order.customerName} />
                <DetailRow label="Customer Phone" value={order.customerPhone} />
                <DetailRow label="Delivery Address" value={order.deliveryAddress} />
                <DetailRow label="State" value={order.deliveryState} />
                <DetailRow label="Status" value={<OrderStatusBadge status={order.status} />} />
                <DetailRow label="Date Created" value={new Date(order.createdAt).toLocaleString()} />
                <DetailRow label="Last Updated" value={new Date(order.updatedAt).toLocaleString()} />
                <DetailRow label="Tracking ID" value={order.trackingId} />
                {order.trackingId && (
                    <DetailRow 
                        label="Tracking Link" 
                        value={
                            <Link 
                                href={`/track/${order.trackingId}`} 
                                className="text-primary hover:underline"
                                target="_blank"
                            >
                                View Tracking Page
                            </Link>
                        } 
                    />
                )}
            </dl>
            
            {order.items && order.items.length > 0 && (
                <>
                    <Separator className="my-4" />
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><ShoppingCart className="h-5 w-5" />Order Summary</h3>
                        <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span>{item.name}</span>
                                    <span className="font-medium">{formatCurrency(item.price)}</span>
                                </div>
                            ))}
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span>{formatCurrency(order.totalAmount || 0)}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <Separator className="my-4" />

             <div className="mt-6">
                <h3 className="text-lg font-medium">Payment Receipt</h3>
                <div className="mt-2 flex items-center justify-center border-2 border-dashed rounded-lg p-12 text-center bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                        Payment receipt uploads are not yet implemented.
                    </p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
