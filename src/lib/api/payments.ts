import { api, BACKEND_CONTRATOS_PAGOS } from './client';
import { normalizePayment, denormalizePayment } from './normalize';
import type { Payment } from '@/app/types';

const BASE = BACKEND_CONTRATOS_PAGOS;

export async function fetchPayments(userId?: string): Promise<Payment[]> {
  const data = userId
    ? await api.get<unknown>(`/api/Payments/contract/${userId}`, BASE)
    : [];
  let normalized = Array.isArray(data) ? data.map(normalizePayment) : [];

  if (userId) {
    normalized = normalized.filter(p => p.duenoId === userId || p.inquilinoId === userId);
  }
  return normalized;
}

export async function fetchPayment(id: string): Promise<Payment> {
  const raw = await api.get<unknown>(`/api/Payments/${id}`, BASE);
  return normalizePayment(raw);
}

export async function createPayment(payment: Partial<Payment>): Promise<Payment> {
  const raw = await api.post<unknown>('/api/Payments', denormalizePayment(payment), BASE);
  return normalizePayment(raw);
}

export async function updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
  const raw = await api.put<unknown>(`/api/Payments/${id}/review`, denormalizePayment({ ...updates, id }), BASE);
  return normalizePayment(raw);
}
