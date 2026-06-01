import { api } from './client';
import { normalizeContract } from './normalize';
import type { Contract } from '@/app/types';

export async function fetchContracts(userId?: string): Promise<Contract[]> {
  const data = await api.get('/contratos');
  let normalized = Array.isArray(data) ? data.map(normalizeContract) : [];

  if (userId) {
    normalized = normalized.filter(c => c.duenoId === userId || c.inquilinoId === userId);
  }
  return normalized;
}

export async function fetchContract(id: string): Promise<Contract> {
  const raw = await api.get(`/contratos/${id}`);
  return normalizeContract(raw);
}

export async function createContract(contract: Omit<Contract, 'id'>): Promise<Contract> {
  const raw = await api.post('/contratos', contract);
  return normalizeContract(raw);
}

export async function updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
  const raw = await api.put(`/contratos/${id}`, updates);
  return normalizeContract(raw);
}
