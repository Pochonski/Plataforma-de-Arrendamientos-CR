import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

/**
 * Página de callback para GitHub OAuth.
 * GitHub redirige aquí con ?code=...&state=... y esta página
 * postea el mensaje a la ventana padre (que abrió el popup) y se cierra.
 */
export default function GitHubCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'github-oauth-callback',
          code,
          state,
          error: error
            ? `${error}${errorDescription ? `: ${errorDescription}` : ''}`
            : undefined,
        },
        window.location.origin,
      );
    }

    const timer = setTimeout(() => {
      window.close();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin inline-block size-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-muted-foreground">Cerrando ventana de GitHub...</p>
        <p className="text-xs text-muted-foreground/70">Si la ventana no se cierra automáticamente, podés cerrarla manualmente.</p>
      </div>
    </div>
  );
}
