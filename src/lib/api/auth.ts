import { api } from './client';
import type { User } from '@/app/types';

export async function login(correo: string, contrasena: string): Promise<{ token: string; user: User }> {
  return api.post('/auth/login', { correo, contrasena });
}

export async function googleAuth(googleToken: string, rol: 'dueno' | 'inquilino', nonce?: string): Promise<{ token: string; user: User }> {
  return api.post('/auth/google', { googleToken, rol, nonce });
}

export async function refreshToken(): Promise<{ token: string; user: User }> {
  return api.post('/auth/refresh', {});
}
