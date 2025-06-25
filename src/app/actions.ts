'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createOrder, updateOrder, getOrder, updateOrderStatus } from '@/services/orderService';
import type { OrderStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function createSaleAction(ownerId: string) {
  const newOrder = await createOrder({
    ownerId,
    status: 'Created',
  });

  revalidatePath('/dashboard');
  return { success: true, orderId: newOrder.id };
}

const saleFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  address: z.string().min(10, 'Please enter a valid address.'),
});

export async function submitOrderAction(orderId: string, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const validationResult = saleFormSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    // This is a basic error handling. In a real app, you might return detailed errors.
    throw new Error('Invalid form data.');
  }

  const { name, address, phone } = validationResult.data;
  const trackingId = uuidv4().replace(/-/g, '').substring(0, 12);

  await updateOrder(orderId, {
    customerName: name,
    deliveryAddress: address,
    customerPhone: phone,
    status: 'Pending',
    trackingId,
  });

  redirect(`/track/${trackingId}?new=true`);
}

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status);
    revalidatePath('/dashboard');
    return { success: true, message: `Order status updated to ${status}` };
}

export async function cancelOrderAction(orderId: string) {
    await updateOrderStatus(orderId, 'Canceled');
    revalidatePath('/dashboard');
    return { success: true, message: 'Order has been canceled.' };
}
