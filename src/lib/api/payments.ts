import { api } from './client';
import { normalizePayment, denormalizePayment } from './normalize';
import type { Payment } from '@/app/types';

export async function fetchPayments(userId?: string): Promise<Payment[]> {
  const url = userId ? `/pagos/${userId}` : '/pagos';
  const data = await api.get(url);
  let normalized = Array.isArray(data) ? data.map(normalizePayment) : [];

  if (userId) {
    normalized = normalized.filter(p => p.duenoId === userId || p.inquilinoId === userId);
  }
  return normalized;
}

export async function fetchPayment(id: string): Promise<Payment> {
  const raw = await api.get(`/pagos/${id}`);
  return normalizePayment(raw);
}

export async function createPayment(payment: Partial<Payment>): Promise<Payment> {
  const raw = await api.post('/pagos', denormalizePayment(payment));
  return normalizePayment(raw);
}

export async function updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
  const raw = await api.put(`/pagos/${id}`, denormalizePayment({ ...updates, id }));
  return normalizePayment(raw);
}
