export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Created' | 'Canceled';

export type Order = {
  id: string; // Firestore document ID
  ownerId: string;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  deliveryState?: string;
  paymentReceiptUrl?: string; // URL to the uploaded receipt
  status: OrderStatus;
  createdAt: string; // ISO 8601 string date format
  updatedAt: string; // ISO 8601 string date format
  trackingId?: string;
};
