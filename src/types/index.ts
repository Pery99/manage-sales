export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Created' | 'Canceled';

export type OrderItem = {
  name: string;
  price: number;
};

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
  items?: OrderItem[];
  totalAmount?: number;
};

export type UserProfile = {
    id: string; // Same as Firebase Auth UID
    businessName: string;
    businessPhoneNumber: string;
}
