import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, createNotification, markNotificationRead, markNotificationUnread } from '@/lib/api/notifications';
import type { Notification } from '@/app/types';

const NOTIFICATIONS_KEY = 'notifications';

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: [NOTIFICATIONS_KEY, userId],
    queryFn: () => fetchNotifications(userId),
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notification: Omit<Notification, 'id'>) =>
      createNotification(notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] });
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] });
    },
  });
}

export function useMarkNotificationUnread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] });
    },
  });
}
