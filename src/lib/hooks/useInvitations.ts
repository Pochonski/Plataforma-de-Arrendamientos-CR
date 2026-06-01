import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInvitations, fetchInvitation, fetchInvitationByToken, createInvitation, updateInvitation } from '@/lib/api/invitations';
import type { Invitation } from '@/app/types';

const INVITATIONS_KEY = 'invitations';

export function useInvitations(userId: string) {
  return useQuery({
    queryKey: [INVITATIONS_KEY, userId],
    queryFn: () => fetchInvitations(userId),
    enabled: !!userId,
  });
}

export function useInvitation(id: string) {
  return useQuery({
    queryKey: [INVITATIONS_KEY, id],
    queryFn: () => fetchInvitation(id),
    enabled: !!id,
  });
}

export function useInvitationByToken(token: string) {
  return useQuery({
    queryKey: [INVITATIONS_KEY, 'token', token],
    queryFn: () => fetchInvitationByToken(token),
    enabled: !!token,
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitation: Omit<Invitation, 'id' | 'token' | 'fechaEmision' | 'fechaExpiracion' | 'estado'>) =>
      createInvitation(invitation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVITATIONS_KEY] });
    },
  });
}

export function useUpdateInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Invitation> }) =>
      updateInvitation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVITATIONS_KEY] });
    },
  });
}
