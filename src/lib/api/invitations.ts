import { api, BACKEND_CONTRATOS_PAGOS } from './client';
import { normalizeInvitation } from './normalize';
import type { Invitation } from '@/app/types';

const BASE = BACKEND_CONTRATOS_PAGOS;

export async function fetchInvitations(userId: string): Promise<Invitation[]> {
  const data = await api.get<unknown>(`/api/Invitations/owner/${userId}`, BASE);
  return Array.isArray(data) ? data.map(normalizeInvitation) : [];
}

export async function fetchInvitation(id: string): Promise<Invitation> {
  const raw = await api.get<unknown>(`/api/Invitations/${id}`, BASE);
  return normalizeInvitation(raw);
}

export async function createInvitation(
  invitation: Omit<Invitation, 'id' | 'token' | 'fechaEmision' | 'fechaExpiracion' | 'estado'>,
): Promise<Invitation> {
  const raw = await api.post<unknown>('/api/Invitations', invitation, BASE);
  return normalizeInvitation(raw);
}

export async function updateInvitation(id: string, updates: Partial<Invitation>): Promise<Invitation> {
  const raw = await api.put<unknown>(`/api/Invitations/${id}`, updates, BASE);
  return normalizeInvitation(raw);
}

export async function fetchInvitationByToken(token: string): Promise<Invitation | undefined> {
  const raw = await api.get<unknown>(`/api/Invitations/token/${token}`, BASE);
  return raw ? normalizeInvitation(raw) : undefined;
}
