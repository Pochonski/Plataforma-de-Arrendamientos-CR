import { api, API_BASE } from './client';
import type { User } from '@/app/types';

export async function fetchUser(id: string): Promise<User> {
  return api.get(`/usuario/${id}`, API_BASE);
}

export async function createUser(data: {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: 'dueno' | 'inquilino';
  telefono?: string;
}): Promise<User> {
  return api.post('/usuarios', data, API_BASE);
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return api.put(`/usuario/${id}`, data, API_BASE);
}
