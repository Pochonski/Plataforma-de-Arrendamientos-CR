import { api } from './client';
import type { User } from '@/app/types';

export async function fetchUsers(): Promise<User[]> {
  return api.get('/usuarios');
}

export async function fetchUser(id: string, token?: string): Promise<User> {
  return api.get(`/usuario/${id}`, undefined, token ? { 'Authorization': `Bearer ${token}` } : undefined);
}

export async function createUser(data: {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: 'dueno' | 'inquilino';
  telefono?: string;
}): Promise<{ token: string; refreshToken: string; user: User }> {
  return api.post('/auth/registro', data);
}

export async function updateUser(id: string, data: Partial<User>, token?: string): Promise<User> {
  return api.put(`/usuario/${id}`, data, undefined, token ? { 'Authorization': `Bearer ${token}` } : undefined);
}
