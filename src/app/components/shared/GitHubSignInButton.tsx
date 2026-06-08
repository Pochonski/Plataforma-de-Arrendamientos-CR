import { useEffect, useRef } from 'react';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const STATE_KEY = 'github_oauth_state';

function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function buildAuthorizeUrl(clientId: string, redirectUri: string, state: string): string {
  const url = new URL(GITHUB_AUTHORIZE_URL);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'read:user user:email');
  url.searchParams.set('state', state);
  url.searchParams.set('allow_signup', 'true');
  return url.toString();
}

export interface GitHubSignInButtonProps {
  clientId: string;
  redirectUri: string;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  onSuccess: (code: string) => void;
  onError?: (message: string) => void;
}

export function GitHubSignInButton({
  clientId,
  redirectUri,
  text = 'signin_with',
  onSuccess,
  onError,
}: GitHubSignInButtonProps) {
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Solo aceptar mensajes del mismo origen (callback page)
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; code?: string; state?: string; error?: string };
      if (!data || data.type !== 'github-oauth-callback') return;
      if (data.error) {
        onErrorRef.current?.(data.error);
        return;
      }
      const expectedState = sessionStorage.getItem(STATE_KEY);
      if (!data.state || !expectedState || data.state !== expectedState) {
        onErrorRef.current?.('State inválido — posible CSRF');
        return;
      }
      sessionStorage.removeItem(STATE_KEY);
      if (data.code) {
        onSuccessRef.current(data.code);
      } else {
        onErrorRef.current?.('No se recibió code de GitHub');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleClick = () => {
    if (!clientId) {
      onErrorRef.current?.('GitHub Client ID no configurado');
      return;
    }
    const state = generateState();
    sessionStorage.setItem(STATE_KEY, state);
    const url = buildAuthorizeUrl(clientId, redirectUri, state);
    const popup = window.open(url, 'github-oauth', 'width=600,height=700,left=' + (window.screen.width / 2 - 300) + ',top=' + (window.screen.height / 2 - 350));
    if (!popup) {
      onErrorRef.current?.('No se pudo abrir la ventana de GitHub. Verifica que los popups no estén bloqueados.');
    }
  };

  const label = text === 'signup_with'
    ? 'Registrarse con GitHub'
    : text === 'continue_with'
    ? 'Continuar con GitHub'
    : 'Iniciar sesión con GitHub';

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
      {label}
    </button>
  );
}
