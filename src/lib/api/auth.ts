import { api, APIM_URL, API_BASE, APIM_KEY, API_PREFIX } from './client';
import type { User } from '@/app/types';
import { parseAuthError } from './errors';

async function authPost<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = APIM_URL || API_BASE;
  const normalizedPath = path.startsWith(API_PREFIX) ? path : `${API_PREFIX}${path}`;
  const url = `${baseUrl}${normalizedPath}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (APIM_KEY) headers['Ocp-Apim-Subscription-Key'] = APIM_KEY;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) throw await parseAuthError(res);
  const text = await res.text();
  if (!text) {
    throw new Error('Respuesta vacía del servidor de autenticación');
  }
  return JSON.parse(text) as T;
}

export async function login(correo: string, contrasena: string): Promise<{ token: string; refreshToken: string; user: User }> {
  return authPost('/auth/login', { correo, contrasena });
}

export async function googleAuth(googleToken: string, rol: 'dueno' | 'inquilino', nonce?: string): Promise<{ token: string; refreshToken: string; user: User }> {
  return authPost('/auth/google', { googleToken, rol, nonce });
}

export async function refreshToken(refreshToken?: string): Promise<{ token: string; refreshToken: string; user: User }> {
  return api.post('/auth/refresh', { refreshToken }, undefined, {
    'X-Refresh-Token': refreshToken || '',
  });
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout', {});
}
