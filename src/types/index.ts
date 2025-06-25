export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Created' | 'Canceled';

export type Order = {
  id: string;
  ownerId: string;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  paymentReceiptUrl?: string;
  status: OrderStatus;
  createdAt: Date;
  trackingId: string;
  saleLink: string;
};
