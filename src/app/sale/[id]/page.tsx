import SaleForm from '@/components/sale-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ShoppingCart } from 'lucide-react';
import { getOrder } from '@/services/orderService';
import { getUserProfile } from '@/services/userService';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (amount: number) => {
    // Fallback for environments where Intl might not be fully supported, or for amount being null/undefined.
    if (typeof amount !== 'number') {
        amount = 0;
    }
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

export default async function SalePage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

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

  const businessProfile = await getUserProfile(order.ownerId);

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            {businessProfile?.businessName || 'Complete Your Order'}
          </CardTitle>
          <CardDescription>
            Please confirm your order details and provide your information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {order.items && order.items.length > 0 && (
            <div className="mb-6">
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
          )}
          <Separator className="mb-6" />
          <SaleForm orderId={order.id} />
        </CardContent>
      </Card>
    </div>
  );
}
