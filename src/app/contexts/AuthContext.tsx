import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (correo: string, contraseña: string) => Promise<boolean>;
  loginWithGoogle: (credentialResponse: any) => Promise<boolean>;
  register: (nombre: string, correo: string, contraseña: string, rol: 'dueño' | 'inquilino') => Promise<boolean>;
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

  useEffect(() => {
    // LocalStorage ha sido removido según las reglas del proyecto.
    // El usuario debe iniciar sesión al cargar la página manualmente
    // validándose con la API de Azure APIM en la función de login.
  }, []);

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
            setUser(normalizeUser(foundUser));
            return true;
          }
        }
      }
    } catch (err) {
      console.error("Error validando usuario contra Azure APIM", err);
    }
    return false;
  };

  const loginWithGoogle = async (credentialResponse: any): Promise<boolean> => {
    try {
      // Verificar que credentialResponse tenga la estructura esperada
      if (!credentialResponse?.credential) {
        console.error("Google OAuth: credential es undefined", credentialResponse);
        return false;
      }

      // Decodificar el token de Google
      const token = credentialResponse.credential;
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Crear usuario con datos de Google
      const googleUser: User = {
        id: payload.sub || payload.email,
        nombre: payload.name,
        correo: payload.email,
        rol: 'inquilino', // Por defecto, el usuario puede cambiar después
      };

      setUser(googleUser);
      return true;
    } catch (err) {
      console.error("Error con login de Google:", err);
      return false;
    }
  };

  const register = async (nombre: string, correo: string, contraseña: string, rol: 'dueño' | 'inquilino'): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      nombre,
      correo,
      rol,
    };
    setUser(newUser);
    // localstorage eliminado por requerimiento
    return true;
  };

  const logout = () => {
    setUser(null);
    // localstorage eliminado
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // localstorage eliminado
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
