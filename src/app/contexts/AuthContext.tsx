import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SignJWT } from 'jose';
import { User } from '../types';
import { useData } from './DataContext';

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

interface GoogleUserData {
  id: string;
  nombre: string;
  correo: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (correo: string, contraseña: string) => Promise<boolean>;
  loginWithGoogle: (credentialResponse: GoogleCredentialResponse, rol: 'dueño' | 'inquilino', googleUserData: GoogleUserData, isExisting?: boolean) => Promise<boolean>;
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
 * Se usa para autenticar conexiones WebSocket (ms-notificaciones)
 * y Socket.io (ms-mensajes).
 *
 * El secreto se lee de la variable de entorno VITE_JWT_SECRET.
 * Tiempo de expiración: 24 horas.
 */
async function generarToken(userId: string, nombre: string): Promise<string> {
  const secretStr = import.meta.env.VITE_JWT_SECRET || 'secret_seguro_aqui_123456789';
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

  /** Establece el usuario autenticado y genera el JWT correspondiente */
  const autenticar = async (u: User) => {
    setUser(u);
    try {
      const jwt = await generarToken(u.id, u.nombre);
      setToken(jwt);
    } catch (err) {
      console.error('[Auth] Error generando JWT:', err);
      setToken(null);
    }
  };

  const login = async (correo: string, contraseña: string): Promise<boolean> => {
    try {
      // Login con API de Azure APIM
      const apiUrl = import.meta.env.VITE_API_URL;
      if (apiUrl) {
        const response = await fetch(`${apiUrl}/usuarios`);
        if (response.ok) {
          const usuarios = await response.json();
          const foundUser = usuarios.find((u: any) => u.correo === correo);
          if (foundUser) {
            // Normalize role from APIM ("dueno" → "dueño")
            const normalizedUser = normalizeUser(foundUser);
            await autenticar(normalizedUser);
            return true;
          }
        }
      }
    } catch (err) {
      console.error("Error validando usuario contra Azure APIM", err);
    }
    return false;
  };

  const loginWithGoogle = async (
    credentialResponse: GoogleCredentialResponse,
    rol: 'dueño' | 'inquilino',
    googleUserData: GoogleUserData,
    isExisting?: boolean
  ): Promise<boolean> => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        console.error("Google OAuth: VITE_API_URL no está configurado");
        return false;
      }

      // If user already exists, use the DB id passed via googleUserData.id
      if (isExisting) {
        const u: User = { id: googleUserData.id, nombre: googleUserData.nombre, correo: googleUserData.correo, rol };
        await autenticar(u);
        return true;
      }

      // Map role to backend format (dueño -> dueno)
      const backendRol = rol === 'dueño' ? 'dueno' : 'inquilino';

      // Create user in the backend
      const response = await fetch(`${apiUrl}/usuario/${googleUserData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': import.meta.env.VITE_APIM_SUBSCRIPTION_KEY || '',
        },
        body: JSON.stringify({
          nombre: googleUserData.nombre,
          correo: googleUserData.correo,
          contrasena: '',
          rol: backendRol,
          telefono: ''
        }),
      });

      if (response.ok) {
        // Fetch the actual user from DB to get normalized data
        const getResponse = await fetch(`${apiUrl}/usuarios`);
        if (getResponse.ok) {
          const usuarios = await getResponse.json();
          const createdUser = usuarios.find((u: any) => u.correo === googleUserData.correo);
          if (createdUser) {
            await autenticar(normalizeUser(createdUser));
            return true;
          }
        }
        // Fallback to local user if DB fetch fails
        const u: User = { id: googleUserData.id, nombre: googleUserData.nombre, correo: googleUserData.correo, rol };
        await autenticar(u);
        return true;
      } else if (response.status === 409) {
        // User already exists
        const u: User = { id: googleUserData.id, nombre: googleUserData.nombre, correo: googleUserData.correo, rol };
        await autenticar(u);
        return true;
      } else {
        const errorText = await response.text();
        console.error("Google OAuth: Error creando usuario:", errorText);
        return false;
      }
    } catch (err) {
      console.error("Error con login de Google:", err);
      return false;
    }
  };

  const register = async (nombre: string, correo: string, contraseña: string, rol: 'dueño' | 'inquilino', telefono?: string): Promise<boolean> => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) return false;

      // Map role to backend format (dueño -> dueno)
      const backendRol = rol === 'dueño' ? 'dueno' : 'inquilino';
      const tempId = `usr-${Math.floor(Math.random() * 10000)}`;

      const response = await fetch(`${apiUrl}/usuario/${tempId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': import.meta.env.VITE_APIM_SUBSCRIPTION_KEY || '',
        },
        body: JSON.stringify({
          nombre,
          correo,
          contraseña,
          rol: backendRol,
          telefono,
          fechaRegistro: new Date().toISOString(),
          propiedades: []
        }),
      });

      if (response.ok) {
        const responseText = await response.text();
        let createdUser = null;
        if (responseText) {
          try {
            createdUser = JSON.parse(responseText);
          } catch (e) {
            console.error("Error parseando la respuesta del servidor:", e);
          }
        }
        if (createdUser && (createdUser.id || createdUser.idUsuario)) {
          await autenticar(normalizeUser(createdUser));
          return true;
        } else {
          const fallbackUser = { id: tempId, nombre, correo, rol: backendRol as 'dueño' | 'inquilino', telefono };
          await autenticar(normalizeUser(fallbackUser));
          return true;
        }
      } else {
        const errorText = await response.text();
        console.error("Error en la respuesta del servidor:", errorText);
      }
    } catch (err) {
      console.error("Error crítico registrando usuario:", err);
    }
    return false;
  };

  const { updateUser: updateUserApi } = useData();

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await updateUserApi(user.id, updates);
    await autenticar(updated);
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
