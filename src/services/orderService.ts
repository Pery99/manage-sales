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
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

// Helper to convert Firestore data to our Order type
const fromFirestore = (doc: any): Order => {
  const data = doc.data();
  // Fallback to current date if timestamp is missing to prevent crashes
  const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString();
  const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : new Date().toISOString();

  return {
    id: doc.id,
    ownerId: data.ownerId,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    deliveryAddress: data.deliveryAddress,
    paymentReceiptUrl: data.paymentReceiptUrl,
    status: data.status,
    createdAt: createdAt,
    updatedAt: updatedAt,
    trackingId: data.trackingId,
  };
};

/**
 * Creates a new order with 'Created' status.
 * @param orderData - Minimal data for a new order.
 * @returns The newly created order object.
 */
export async function createOrder(orderData: { ownerId: string; status: 'Created' }): Promise<Order> {
  if (!db) {
    throw new Error("Firestore is not initialized. Cannot create order. Check your Firebase configuration.");
  }
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
  if (!db) {
    throw new Error("Firestore is not initialized. Cannot update order. Check your Firebase configuration.");
  }
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
 * Updates the status for multiple orders in a single batch.
 * @param orderIds - An array of order IDs to update.
 * @param status - The new status to set for all orders.
 */
export async function bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<void> {
    if (!db) {
        throw new Error("Firestore is not initialized. Cannot perform bulk update.");
    }
    const batch = writeBatch(db);
    const now = serverTimestamp();

    orderIds.forEach(orderId => {
        const orderRef = doc(db, 'orders', orderId);
        batch.update(orderRef, { status, updatedAt: now });
    });

    await batch.commit();
}


/**
 * Fetches a single order by its ID.
 * @param orderId - The document ID of the order.
 * @returns The order object or null if not found.
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  if (!db) {
    return null;
  }
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
  if (!db) {
    return [];
  }
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
  if (!db) {
    return null;
  }
  const q = query(collection(db, 'orders'), where('trackingId', '==', trackingId), limit(1));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return fromFirestore(querySnapshot.docs[0]);
  } else {
    return null;
  }
}
