import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (correo: string, contraseña: string) => Promise<boolean>;
  register: (nombre: string, correo: string, contraseña: string, rol: 'dueño' | 'inquilino') => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    nombre: 'Carlos Ramírez',
    correo: 'carlos@example.com',
    rol: 'dueño',
  },
  {
    id: '2',
    nombre: 'María González',
    correo: 'maria@example.com',
    rol: 'inquilino',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // LocalStorage ha sido removido según las reglas del proyecto.
    // El usuario debe iniciar sesión al cargar la página manualmente
    // validándose con la API de Azure APIM en la función de login.
  }, []);

  const login = async (correo: string, contraseña: string): Promise<boolean> => {
    try {
      // Login usando Azure APIM
      const response = await fetch('https://plataforma-arrendamientos-api.azure-api.net/api/usuarios');
      const usuariosMock = await response.json();
      
      const foundUser = usuariosMock.find((u: any) => u.correo === correo);
      if (foundUser) {
        setUser(foundUser);
        // localstorage eliminado, el estado muere al refrescar la página según requerimiento.
        return true;
      }
    } catch (err) {
      console.error("Error validando usuario contra Azure APIM", err);
    }
    return false;
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
