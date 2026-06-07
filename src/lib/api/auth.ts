import { api } from './client';
import type { User } from '@/app/types';

export async function login(correo: string, contrasena: string): Promise<{ token: string; refreshToken: string; user: User }> {
  return api.post('/auth/login', { correo, contrasena });
}

export async function googleAuth(googleToken: string, rol: 'dueno' | 'inquilino', nonce?: string): Promise<{ token: string; refreshToken: string; user: User }> {
  return api.post('/auth/google', { googleToken, rol, nonce });
}

export async function refreshToken(refreshToken?: string): Promise<{ token: string; refreshToken: string; user: User }> {
  return api.post('/auth/refresh', { refreshToken }, undefined, {
    'X-Refresh-Token': refreshToken || '',
  });
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout', {});
}
