import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useData } from './DataContext';

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

interface AuthContextType {
  user: User | null;
  login: (correo: string, contraseña: string) => Promise<boolean>;
  loginWithGoogle: (credentialResponse: GoogleCredentialResponse) => Promise<boolean>;
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

  useEffect(() => {
    // Session restored on page load via API validation in login()
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

  const loginWithGoogle = async (credentialResponse: GoogleCredentialResponse): Promise<boolean> => {
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
          contraseña, // En una app real, el hash se maneja en el backend o antes de enviar
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
          setUser(normalizeUser(createdUser));
          return true;
        } else {
          const fallbackUser = {
            id: tempId,
            nombre,
            correo,
            rol: backendRol,
            telefono,
          };
          setUser(normalizeUser(fallbackUser));
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
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await updateUserApi(user.id, updates);
    setUser(updated);
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
