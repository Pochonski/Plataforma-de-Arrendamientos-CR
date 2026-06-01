import { api } from './client';
import { normalizeNotification } from './normalize';
import type { Notification } from '@/app/types';

export async function fetchNotifications(userId?: string): Promise<Notification[]> {
  const endpoint = userId ? `/notificaciones/${userId}` : '/notificaciones';
  const data = await api.get(endpoint);
  let normalized = Array.isArray(data) ? data.map(normalizeNotification) : [];

  if (userId) {
    normalized = normalized.filter(n =>
      (n as Record<string, unknown>).userId === userId ||
      (n as Record<string, unknown>).duenoId === userId ||
      (n as Record<string, unknown>).inquilinoId === userId,
    );
  }
  return normalized;
}

export async function createNotification(notification: Omit<Notification, 'id'>): Promise<Notification> {
  const raw = await api.post('/notificaciones', notification);
  return normalizeNotification(raw);
}

export async function markNotificationRead(id: string): Promise<Notification> {
  const raw = await api.put(`/notificaciones/${id}`, { leida: true });
  return normalizeNotification(raw);
}

export async function markNotificationUnread(id: string): Promise<Notification> {
  const raw = await api.put(`/notificaciones/${id}`, { leida: false });
  return normalizeNotification(raw);
}
