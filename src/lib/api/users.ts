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
}): Promise<{ token: string; user: User }> {
  return api.post('/auth/registro', data);
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return api.put(`/usuario/${id}`, data);
}
