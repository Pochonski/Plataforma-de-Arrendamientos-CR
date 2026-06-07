import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUser, updateUser } from '@/lib/api/users';
import type { User } from '@/app/types';
import { useAuth } from '@/app/contexts/AuthContext';

const USERS_KEY = 'users';

export function useUser(id: string) {
  const { token } = useAuth();
  return useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: () => fetchUser(id, token ?? undefined),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      updateUser(id, data, token ?? undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}