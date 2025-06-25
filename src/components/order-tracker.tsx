'use client';

import type { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Loader, Package, Truck, Home } from 'lucide-react';

interface OrderTrackerProps {
  currentStatus: OrderStatus;
}

const statusMap: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const ICONS: Record<OrderStatus, React.ElementType> = {
    Pending: Loader,
    Processing: Package,
    Shipped: Truck,
    Delivered: Home,
    Created: Loader, // Fallback icon
    Canceled: Loader, // Fallback icon
};

export default function OrderTracker({ currentStatus }: OrderTrackerProps) {
  const currentIndex = statusMap.indexOf(currentStatus);

  return (
    <div className="w-full p-4">
      <div className="flex items-center">
        {statusMap.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const Icon = ICONS[status as OrderStatus] || Package;

          return (
            <div key={status} className="flex items-center w-full">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300',
                    isCompleted ? 'bg-primary border-primary text-primary-foreground' : '',
                    isActive ? 'bg-primary/20 border-primary text-primary animate-pulse' : '',
                    !isCompleted && !isActive ? 'bg-muted border-muted-foreground/20 text-muted-foreground' : ''
                  )}
                >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <p className={cn("mt-2 text-sm text-center font-medium", isActive ? 'text-primary' : 'text-muted-foreground')}>
                    {status}
                </p>
              </div>

              {index < statusMap.length - 1 && (
                <div
                  className={cn(
                    'flex-auto border-t-2 transition-colors duration-300 mx-4',
                    isCompleted ? 'border-primary' : 'border-muted-foreground/20'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
