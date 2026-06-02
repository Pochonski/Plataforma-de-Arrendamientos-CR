import { api } from './client';
import type { User } from '@/app/types';

export async function googleAuth(googleToken: string, rol: 'dueno' | 'inquilino'): Promise<User> {
  return api.post('/auth/google', { googleToken, rol });
}
