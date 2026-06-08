import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProperties, fetchProperty, createProperty, updateProperty, deleteProperty } from '@/lib/api/properties';
import type { Property } from '@/app/types';

const PROPERTIES_KEY = 'properties';

export function useProperties(page: number = 1, filters?: Parameters<typeof fetchProperties>[1]) {
  return useQuery({
    queryKey: [PROPERTIES_KEY, page, filters],
    queryFn: () => fetchProperties(page, filters),
    // Unwrap the PropertiesResponse envelope so callers can do `data.filter(...)`
    // directly. Before this, `data` was the full response object ({data, total,
    // page, totalPages}) and calling .filter on it threw 'f.filter is not a function'.
    // Pages that need pagination meta (total/page/totalPages) should call
    // fetchProperties() directly via useQuery without this select.
    select: (res) => (res as { data: Property[] }).data,
  });
}

/**
 * Versión que devuelve el response completo (data, total, page, totalPages)
 * para páginas con paginación (Landing, Propiedades, DuenoDashboard).
 */
export function usePropertiesPaged(page: number = 1, filters?: Parameters<typeof fetchProperties>[1]) {
  return useQuery({
    queryKey: [PROPERTIES_KEY, 'paged', page, filters],
    queryFn: () => fetchProperties(page, filters),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: [PROPERTIES_KEY, id],
    queryFn: () => fetchProperty(id),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Property>) => createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
      updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY] });
    },
  });
}
