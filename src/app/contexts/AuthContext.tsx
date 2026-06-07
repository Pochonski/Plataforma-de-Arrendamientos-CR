import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { updateUser as updateUserApi, createUser } from '@/lib/api/users';
import { login as loginApi, googleAuth, logout as logoutApi } from '@/lib/api/auth';
import { AuthError } from '@/lib/api/errors';

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (correo: string, contraseña: string) => Promise<void>;
  loginWithGoogle: (googleToken: string, rol: 'dueño' | 'inquilino', nonce?: string) => Promise<boolean>;
  register: (nombre: string, correo: string, contraseña: string, rol: 'dueño' | 'inquilino', telefono?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Normalize the user object received from APIM:
// - APIM returns rol: "dueno" (no tilde), frontend expects 'dueño' | 'inquilino'
const normalizeUser = (raw: any): User => ({
  ...raw,
  rol: raw.rol === 'dueno' || raw.rol === 'arrendador' ? 'dueño'
     : raw.rol === 'arrendatario' ? 'inquilino'
     : raw.rol ?? 'inquilino',
});

const STORAGE_KEY_TOKEN = 'auth_token';
const STORAGE_KEY_REFRESH = 'auth_refresh_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY_TOKEN));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY_REFRESH));

  /** Establece el usuario autenticado con token del backend */
  const autenticar = async (u: User, t: string | null, rt: string | null) => {
    setUser(u);
    setToken(t);
    setRefreshToken(rt);
    if (t) localStorage.setItem(STORAGE_KEY_TOKEN, t);
    else localStorage.removeItem(STORAGE_KEY_TOKEN);
    if (rt) localStorage.setItem(STORAGE_KEY_REFRESH, rt);
    else localStorage.removeItem(STORAGE_KEY_REFRESH);
  };

  const login = async (correo: string, contrasena: string): Promise<void> => {
    const { token, refreshToken: rt, user } = await loginApi(correo, contrasena);
    await autenticar(normalizeUser(user), token, rt);
  };

  const loginWithGoogle = async (
    googleToken: string,
    rol: 'dueño' | 'inquilino',
    nonce?: string,
  ): Promise<boolean> => {
    try {
      const backendRol = rol === 'dueño' ? 'dueno' : 'inquilino';
      const { token, refreshToken: rt, user } = await googleAuth(googleToken, backendRol, nonce);
      await autenticar(normalizeUser(user), token, rt);
      return true;
    } catch (err) {
      console.error('Error con login de Google:', err);
      return false;
    }
  };

  const register = async (nombre: string, correo: string, contrasena: string, rol: 'dueño' | 'inquilino', telefono?: string): Promise<boolean> => {
    try {
      const backendRol = rol === 'dueño' ? 'dueno' : 'inquilino';

      const { token, refreshToken: rt, user } = await createUser({
        nombre,
        correo,
        contrasena,
        rol: backendRol,
        telefono,
      });

      await autenticar(normalizeUser(user), token, rt);
      return true;
    } catch (err) {
      console.error('Error crítico registrando usuario:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Error en logout:', err);
    } finally {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_REFRESH);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await updateUserApi(user.id, updates);
    // Token stays the same on profile update
    await autenticar(normalizeUser(updated), token, refreshToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}