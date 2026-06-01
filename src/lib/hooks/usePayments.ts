import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPayments, fetchPayment, createPayment, updatePayment } from '@/lib/api/payments';
import type { Payment } from '@/app/types';

const PAYMENTS_KEY = 'payments';

export function usePayments(userId?: string) {
  return useQuery({
    queryKey: [PAYMENTS_KEY, userId],
    queryFn: () => fetchPayments(userId),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: [PAYMENTS_KEY, id],
    queryFn: () => fetchPayment(id),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payment: Partial<Payment>) => createPayment(payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) =>
      updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
    },
  });
}
