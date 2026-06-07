import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { AuthError } from '@/lib/api/errors';

function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function useGoogleAuth() {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [pendingGoogleToken, setPendingGoogleToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cryptographically random nonce — generated once per hook instance (per page load)
  const nonce = useMemo(() => generateNonce(), []);

  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = useCallback(async (credential: string) => {
    setIsLoading(true);
    try {
      if (!credential) {
        toast.error('No se pudo obtener el token de Google');
        return;
      }
      setPendingGoogleToken(credential);
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
        const success = await loginWithGoogle(pendingGoogleToken, rol, nonce);
        if (success) {
          toast.success('¡Bienvenido con Google!');
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        if (err instanceof AuthError) {
          if (err.kind === 'network') {
            toast.error('No se pudo conectar al servidor de Google. Verifica tu conexión.');
          } else {
            toast.error(err.message || 'Error con Google OAuth');
          }
        } else {
          toast.error('No se pudo crear la cuenta con Google');
        }
      } finally {
        setIsLoading(false);
        setShowRoleSelection(false);
        setPendingGoogleToken(null);
      }
    },
    [pendingGoogleToken, loginWithGoogle, navigate, nonce]
  );

  const closeRoleDialog = useCallback(() => {
    setShowRoleSelection(false);
    setPendingGoogleToken(null);
  }, []);

  return {
    nonce,
    showRoleSelection,
    isLoading,
    handleGoogleSuccess,
    handleRoleSelection,
    closeRoleDialog,
  };
}