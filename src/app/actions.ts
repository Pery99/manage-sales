'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createOrder, updateOrder, updateOrderStatus, bulkUpdateStatus } from '@/services/orderService';
import { updateUserProfile } from '@/services/userService';
import type { OrderStatus, OrderItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function updateUserProfileAction(userId: string, data: { businessName: string; businessPhoneNumber: string; }) {
  const rawFormData = data;
  
  const profileSchema = z.object({
    businessName: z.string().min(2, 'Business name must be at least 2 characters.'),
    businessPhoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
  });

  const validationResult = profileSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    throw new Error('Invalid profile data.');
  }

  await updateUserProfile(userId, validationResult.data);
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function createSaleAction(payload: { ownerId: string, items: OrderItem[], totalAmount: number }) {
  const { ownerId, items, totalAmount } = payload;
  const newOrder = await createOrder({
    ownerId,
    status: 'Created',
    items,
    totalAmount,
  });

  revalidatePath('/dashboard');
  return { success: true, orderId: newOrder.id };
}

const saleFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  address: z.string().min(10, 'Please enter a valid address.'),
  state: z.string().min(1, 'Please select a state.'),
});

export async function submitOrderAction(orderId: string, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const validationResult = saleFormSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    // This is a basic error handling. In a real app, you might return detailed errors.
    throw new Error('Invalid form data.');
  }

  const { name, address, phone, state } = validationResult.data;
  const trackingId = uuidv4().replace(/-/g, '').substring(0, 12);

  await updateOrder(orderId, {
    customerName: name,
    deliveryAddress: address,
    customerPhone: phone,
    deliveryState: state,
    status: 'Pending',
    trackingId,
  });

  redirect(`/track/${trackingId}?new=true`);
}

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status);
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/order/${orderId}`);
    return { success: true, message: `Order status updated to ${status}` };
}

export async function bulkUpdateOrderStatusAction(orderIds: string[], status: OrderStatus) {
    await bulkUpdateStatus(orderIds, status);
    revalidatePath('/dashboard');
    // In a real world app you might want to revalidate all individual order pages
    // but that could be a lot of requests. For now, we'll just revalidate the dashboard.
    return { success: true, message: `Updated ${orderIds.length} orders to ${status}` };
}

export async function cancelOrderAction(orderId: string) {
    await updateOrderStatus(orderId, 'Canceled');
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/order/${orderId}`);
    return { success: true, message: 'Order has been canceled.' };
}
