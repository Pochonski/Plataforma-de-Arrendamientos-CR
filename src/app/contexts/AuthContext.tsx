import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { updateUser as updateUserApi, createUser } from '@/lib/api/users';
import { login as loginApi, googleAuth } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (correo: string, contraseña: string) => Promise<boolean>;
  loginWithGoogle: (googleToken: string, rol: 'dueño' | 'inquilino') => Promise<boolean>;
  register: (nombre: string, correo: string, contraseña: string, rol: 'dueño' | 'inquilino', telefono?: string) => Promise<boolean>;
  logout: () => void;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /** Establece el usuario autenticado con token del backend */
  const autenticar = async (u: User, t: string | null) => {
    setUser(u);
    setToken(t);
  };

  const login = async (correo: string, contrasena: string): Promise<boolean> => {
    try {
      const { token, user } = await loginApi(correo, contrasena);
      const normalizedUser = normalizeUser(user);
      await autenticar(normalizedUser, token);
      return true;
    } catch (err) {
      console.error('Error en login:', err);
      return false;
    }
  };

  const loginWithGoogle = async (
    googleToken: string,
    rol: 'dueño' | 'inquilino',
  ): Promise<boolean> => {
    try {
      const backendRol = rol === 'dueño' ? 'dueno' : 'inquilino';
      const { token, user } = await googleAuth(googleToken, backendRol);
      await autenticar(normalizeUser(user), token);
      return true;
    } catch (err) {
      console.error('Error con login de Google:', err);
      return false;
    }
  };

  const register = async (nombre: string, correo: string, contraseña: string, rol: 'dueño' | 'inquilino', telefono?: string): Promise<boolean> => {
    try {
      const backendRol = rol === 'dueño' ? 'dueno' : 'inquilino';

      const { token, user } = await createUser({
        nombre,
        correo,
        contrasena: contraseña,
        rol: backendRol,
        telefono,
      });

      await autenticar(normalizeUser(user), token);
      return true;
    } catch (err) {
      console.error('Error crítico registrando usuario:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await updateUserApi(user.id, updates);
    // Token stays the same on profile update
    await autenticar(normalizeUser(updated), token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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