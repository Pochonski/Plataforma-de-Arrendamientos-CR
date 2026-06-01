import { api } from './client';
import { normalizeInvitation } from './normalize';
import type { Invitation } from '@/app/types';

export async function fetchInvitations(userId: string): Promise<Invitation[]> {
  const data = await api.get(`/invitaciones/${userId}`);
  return Array.isArray(data) ? data.map(normalizeInvitation) : [];
}

export async function fetchInvitation(id: string): Promise<Invitation> {
  const raw = await api.get(`/invitaciones/${id}`);
  return normalizeInvitation(raw);
}

export async function createInvitation(
  invitation: Omit<Invitation, 'id' | 'token' | 'fechaEmision' | 'fechaExpiracion' | 'estado'>,
): Promise<Invitation> {
  const raw = await api.post('/invitaciones', invitation);
  return normalizeInvitation(raw);
}

export async function updateInvitation(id: string, updates: Partial<Invitation>): Promise<Invitation> {
  const raw = await api.put(`/invitaciones/${id}`, updates);
  return normalizeInvitation(raw);
}

export async function fetchInvitationByToken(token: string): Promise<Invitation | undefined> {
  const data = await api.get('/invitaciones');
  const list: Invitation[] = Array.isArray(data) ? data.map(normalizeInvitation) : [];
  return list.find(inv => inv.token === token);
}
