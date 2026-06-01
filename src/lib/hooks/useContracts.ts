import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContracts, fetchContract, createContract, updateContract } from '@/lib/api/contracts';
import type { Contract } from '@/app/types';

const CONTRACTS_KEY = 'contracts';

export function useContracts(userId?: string) {
  return useQuery({
    queryKey: [CONTRACTS_KEY, userId],
    queryFn: () => fetchContracts(userId),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: [CONTRACTS_KEY, id],
    queryFn: () => fetchContract(id),
    enabled: !!id,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contract: Omit<Contract, 'id'>) => createContract(contract),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_KEY] });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contract> }) =>
      updateContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_KEY] });
    },
  });
}
