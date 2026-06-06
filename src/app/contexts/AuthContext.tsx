import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SignJWT } from 'jose';
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

/**
 * Genera un JWT HS256 con claim sub=userId y name=nombre.
 *
 * NOTA DE SEGURIDAD: En producción real el token debería ser emitido
 * exclusivamente por el servidor (endpoint POST /login → token firmado).
 * Este enfoque client-side es válido para una demo universitaria donde:
 *   (a) el shared secret ya está en env vars de los App Services (ms-mensajes,
 *       ms-notificaciones), y (b) no existe endpoint de login con contraseña.
 * Si VITE_JWT_SECRET no está configurada, no se genera token (fail-closed).
 *
 * @throws si VITE_JWT_SECRET no está definida en el entorno
 */
async function generarToken(userId: string, nombre: string): Promise<string> {
  const secretStr = import.meta.env.VITE_JWT_SECRET;
  if (!secretStr) {
    throw new Error('[Auth] VITE_JWT_SECRET no está configurada — no se puede generar token JWT');
  }
  const secret = new TextEncoder().encode(secretStr);

  return new SignJWT({ name: nombre })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Session restored on page load via API validation in login()
  }, []);

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

      const user = await createUser({
        nombre,
        correo,
        contrasena: contraseña,
        rol: backendRol,
        telefono,
      });

      if (user) {
        // TODO (Phase 2): backend should return { token, user } so we don't need client-side token gen
        const jwt = await generarToken(user.id, user.nombre);
        await autenticar(normalizeUser(user), jwt);
        return true;
      }
      return false;
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
