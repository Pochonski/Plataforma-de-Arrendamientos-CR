import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import { AuthError } from '@/lib/api/errors';

export function useGitHubAuth() {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [pendingGitHubCode, setPendingGitHubCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // redirectUri debe coincidir EXACTO con el configurado en la GitHub OAuth App
  const redirectUri = useMemo(
    () => `${window.location.origin}/auth/github/callback`,
    [],
  );

  const { loginWithGitHub } = useAuth();
  const navigate = useNavigate();

  const handleGitHubSuccess = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      if (!code) {
        toast.error('No se pudo obtener el code de GitHub');
        return;
      }
      setPendingGitHubCode(code);
      setShowRoleSelection(true);
    } catch {
      toast.error('Error al procesar login de GitHub');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRoleSelection = useCallback(
    async (rol: 'dueño' | 'inquilino') => {
      if (!pendingGitHubCode) return;
      setIsLoading(true);
      try {
        const success = await loginWithGitHub(pendingGitHubCode, redirectUri, rol);
        if (success) {
          toast.success('¡Bienvenido con GitHub!');
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        if (err instanceof AuthError) {
          if (err.kind === 'network') {
            toast.error('No se pudo conectar al servidor. Verifica tu conexión.');
          } else {
            toast.error(err.message || 'Error con GitHub OAuth');
          }
        } else {
          toast.error('No se pudo crear la cuenta con GitHub');
        }
      } finally {
        setIsLoading(false);
        setShowRoleSelection(false);
        setPendingGitHubCode(null);
      }
    },
    [pendingGitHubCode, loginWithGitHub, navigate, redirectUri]
  );

  const closeRoleDialog = useCallback(() => {
    setShowRoleSelection(false);
    setPendingGitHubCode(null);
  }, []);

  return {
    showRoleSelection,
    isLoading,
    redirectUri,
    handleGitHubSuccess,
    handleRoleSelection,
    closeRoleDialog,
  };
}
