'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SaleFormProps {
  orderId: string;
}

export default function SaleForm({ orderId }: SaleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd get the real tracking ID from the backend.
      const mockTrackingId = 'track_1a2b3c';
      router.push(`/track/${mockTrackingId}?new=true`);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Delivery Address</Label>
        <Textarea id="address" placeholder="123 Main St, Anytown, USA 12345" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="receipt">Proof of Payment</Label>
        <Input id="receipt" type="file" required />
        <p className="text-sm text-muted-foreground">
          Please upload a screenshot or photo of your payment receipt.
        </p>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Order'}
      </Button>
    </form>
  );
}
