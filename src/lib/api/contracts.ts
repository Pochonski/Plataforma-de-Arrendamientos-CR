import { api, BACKEND_CONTRATOS_PAGOS } from './client';
import { normalizeContract } from './normalize';
import type { Contract } from '@/app/types';

const BASE = BACKEND_CONTRATOS_PAGOS;

export async function fetchContracts(userId?: string): Promise<Contract[]> {
  const data = userId
    ? await api.get<unknown>(`/api/Contracts/owner/${userId}`, BASE)
    : [];
  let normalized = Array.isArray(data) ? data.map(normalizeContract) : [];

  if (userId) {
    normalized = normalized.filter(c => c.duenoId === userId || c.inquilinoId === userId);
  }
  return normalized;
}

export async function fetchContract(id: string): Promise<Contract> {
  const raw = await api.get<unknown>(`/api/Contracts/${id}`, BASE);
  return normalizeContract(raw);
}

export async function createContract(contract: Omit<Contract, 'id'>): Promise<Contract> {
  const raw = await api.post<unknown>('/api/Contracts/accept', contract, BASE);
  return normalizeContract(raw);
}

export async function updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
  const raw = await api.put<unknown>(`/api/Contracts/${id}`, updates, BASE);
  return normalizeContract(raw);
}
