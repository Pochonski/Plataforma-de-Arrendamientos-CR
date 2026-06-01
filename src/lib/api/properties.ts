import { api } from './client';
import { normalizeProperty, denormalizeProperty } from './normalize';
import type { Property } from '@/app/types';

const PAGE_SIZE = 6;

interface PropertyFilters {
  search?: string;
  provincia?: string;
  tipo?: string;
  precioMin?: number;
  precioMax?: number;
  duenoId?: string;
}

export interface PropertiesResponse {
  data: Property[];
  total: number;
  page: number;
  totalPages: number;
}

export async function fetchProperties(
  page: number = 1,
  filters?: PropertyFilters,
): Promise<PropertiesResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: PAGE_SIZE.toString(),
  });

  if (filters) {
    if (filters.search) params.append('search', filters.search);
    if (filters.provincia && filters.provincia !== 'todas') params.append('provincia', filters.provincia);
    if (filters.tipo && filters.tipo !== 'todos') params.append('tipo', filters.tipo);
    if (filters.precioMin !== undefined) params.append('precioMin', filters.precioMin.toString());
    if (filters.precioMax !== undefined) params.append('precioMax', filters.precioMax.toString());
    if (filters.duenoId) params.append('duenoId', filters.duenoId);
  }

  const data = await api.get(`/propiedades?${params}`);

  if (Array.isArray(data)) {
    const normalized = data.map(normalizeProperty);
    return {
      data: normalized,
      total: normalized.length,
      page,
      totalPages: Math.ceil(normalized.length / PAGE_SIZE) || 1,
    };
  }
  if (data && Array.isArray(data.data)) {
    return {
      data: data.data.map(normalizeProperty),
      total: data.total || 0,
      page: data.page || page,
      totalPages: data.totalPages || 0,
    };
  }
  return { data: [], total: 0, page, totalPages: 0 };
}

export async function fetchProperty(id: string): Promise<Property> {
  const raw = await api.get(`/propiedades/${id}`);
  return normalizeProperty(raw);
}

export async function createProperty(property: Partial<Property>): Promise<Property> {
  const raw = await api.post('/propiedades', denormalizeProperty(property));
  return normalizeProperty(raw);
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  const raw = await api.put(`/propiedades/${id}`, denormalizeProperty({ ...updates, id }));
  return normalizeProperty(raw);
}

export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/propiedades/${id}`);
}
