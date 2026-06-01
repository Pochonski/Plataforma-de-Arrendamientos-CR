import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as propertiesApi from '@/lib/api/properties';
import type { Property } from '@/app/types';

const PROPERTIES_KEY = 'properties';

export function useProperties(page: number = 1, filters?: Parameters<typeof propertiesApi.fetchProperties>[1]) {
  return useQuery({
    queryKey: [PROPERTIES_KEY, page, filters],
    queryFn: () => propertiesApi.fetchProperties(page, filters),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: [PROPERTIES_KEY, id],
    queryFn: () => propertiesApi.fetchProperty(id),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Property>) => propertiesApi.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
      propertiesApi.updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertiesApi.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
    },
  });
}
