import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as paymentsApi from '@/lib/api/payments';
import type { Payment } from '@/app/types';

const PAYMENTS_KEY = 'payments';

export function usePayments(userId?: string) {
  return useQuery({
    queryKey: [PAYMENTS_KEY, userId],
    queryFn: () => paymentsApi.fetchPayments(userId),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: [PAYMENTS_KEY, id],
    queryFn: () => paymentsApi.fetchPayment(id),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payment: Partial<Payment>) => paymentsApi.createPayment(payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) =>
      paymentsApi.updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
    },
  });
}
