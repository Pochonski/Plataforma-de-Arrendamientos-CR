import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

const CALLBACK_KEY = 'github_oauth_callback';

/**
 * Página de callback para GitHub OAuth.
 * GitHub redirige aquí con ?code=...&state=... y esta página
 * postea el mensaje a la ventana padre (que abrió el popup) y se cierra.
 * También escribe en sessionStorage como fallback por si postMessage
 * no llega (bloqueadores, timing en mobile, etc.).
 */
export default function GitHubCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    const payload = {
      type: 'github-oauth-callback',
      code,
      state,
      error: error
        ? `${error}${errorDescription ? `: ${errorDescription}` : ''}`
        : undefined,
    };

    // Fallback #1: sessionStorage (mismo tab que el opener) + storage event
    // Fallback #2: postMessage al opener (caso normal)
    try {
      if (code) {
        sessionStorage.setItem(CALLBACK_KEY, JSON.stringify({ code, state }));
      }
    } catch {
      // sessionStorage puede fallar en algunos navegadores; ignorar
    }

    if (window.opener) {
      try {
        window.opener.postMessage(payload, window.location.origin);
      } catch {
        // Algunos navegadores rechazan si la ventana está cerrándose; ignorar
      }
    }

    const timer = setTimeout(() => {
      window.close();
    }, 500);

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
