import { api } from './client';
import type { User } from '@/app/types';

export async function fetchUsers(): Promise<User[]> {
  return api.get('/usuarios');
}

export async function fetchUser(id: string): Promise<User> {
  return api.get(`/usuario/${id}`);
}

export async function createUser(data: {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: 'dueno' | 'inquilino';
  telefono?: string;
}): Promise<{ token: string; refreshToken: string; user: User }> {
  const r = await api.post<{ token: string; refreshToken: string; usuario: User }>('/auth/registro', data);
  return { token: r.token, refreshToken: r.refreshToken, user: r.usuario };
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return api.put(`/usuario/${id}`, data);
}
