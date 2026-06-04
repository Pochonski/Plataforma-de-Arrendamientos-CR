import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import type { CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';

export function useGoogleAuth() {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [pendingGoogleToken, setPendingGoogleToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    try {
      const token = credentialResponse.credential as string;
      if (!token) {
        toast.error('No se pudo obtener el token de Google');
        return;
      }
      setPendingGoogleToken(token);
      setShowRoleSelection(true);
    } catch {
      toast.error('Error al procesar login de Google');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRoleSelection = useCallback(
    async (rol: 'dueño' | 'inquilino') => {
      if (!pendingGoogleToken) return;
      setIsLoading(true);
      try {
        const success = await loginWithGoogle(pendingGoogleToken, rol);
        if (success) {
          toast.success('¡Bienvenido con Google!');
          navigate('/dashboard', { replace: true });
        } else {
          toast.error('No se pudo crear la cuenta con Google');
        }
      } catch {
        toast.error('Error al crear cuenta con Google');
      } finally {
        setIsLoading(false);
        setShowRoleSelection(false);
        setPendingGoogleToken(null);
      }
    },
    [pendingGoogleToken, loginWithGoogle, navigate]
  );

  const closeRoleDialog = useCallback(() => {
    setShowRoleSelection(false);
    setPendingGoogleToken(null);
  }, []);

  return {
    showRoleSelection,
    isLoading,
    handleGoogleSuccess,
    handleRoleSelection,
    closeRoleDialog,
  };
}
