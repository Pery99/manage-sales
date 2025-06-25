import { db } from '@/lib/firebase';
import type { Order, OrderStatus } from '@/types';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

// Helper to convert Firestore data to our Order type
const fromFirestore = (doc: any): Order => {
  const data = doc.data();
  return {
    id: doc.id,
    ownerId: data.ownerId,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    deliveryAddress: data.deliveryAddress,
    paymentReceiptUrl: data.paymentReceiptUrl,
    status: data.status,
    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
    updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
    trackingId: data.trackingId,
  };
};

/**
 * Creates a new order with 'Created' status.
 * @param orderData - Minimal data for a new order.
 * @returns The newly created order object.
 */
export async function createOrder(orderData: { ownerId: string; status: 'Created' }): Promise<Order> {
  const now = serverTimestamp();
  const newOrderData = {
    ...orderData,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, 'orders'), newOrderData);
  const docSnap = await getDoc(docRef);
  return fromFirestore(docSnap);
}

/**
 * Updates an existing order.
 * @param orderId - The ID of the order to update.
 * @param dataToUpdate - The fields to update.
 * @returns The updated order object.
 */
export async function updateOrder(orderId: string, dataToUpdate: Partial<Omit<Order, 'id' | 'createdAt'>>): Promise<Order> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
      ...dataToUpdate,
      updatedAt: serverTimestamp(),
  });
  const docSnap = await getDoc(orderRef);
  return fromFirestore(docSnap);
}


/**
 * Updates an existing order's status.
 * @param orderId - The ID of the order to update.
 * @param status - The new status.
 * @returns The updated order object.
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  return updateOrder(orderId, { status });
}

/**
 * Fetches a single order by its ID.
 * @param orderId - The document ID of the order.
 * @returns The order object or null if not found.
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  const docRef = doc(db, 'orders', orderId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return fromFirestore(docSnap);
  } else {
    return null;
  }
}

/**
 * Fetches all orders for a given owner.
 * @param ownerId - The ID of the business owner.
 * @returns An array of orders.
 */
export async function getOrdersByOwner(ownerId: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('ownerId', '==', ownerId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(fromFirestore);
}

/**
 * Fetches a single order by its tracking ID.
 * @param trackingId - The tracking ID of the order.
 * @returns The order object or null if not found.
 * Note: This requires a Firestore index on the `trackingId` field.
 */
export async function getOrderByTrackingId(trackingId: string): Promise<Order | null> {
  const q = query(collection(db, 'orders'), where('trackingId', '==', trackingId), limit(1));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return fromFirestore(querySnapshot.docs[0]);
  } else {
    return null;
  }
}
