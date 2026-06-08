import { useEffect, useRef } from 'react';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const STATE_KEY = 'github_oauth_state';
const CALLBACK_KEY = 'github_oauth_callback';

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

function readCallbackFromStorage(): { code: string; state: string } | null {
  try {
    const raw = sessionStorage.getItem(CALLBACK_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    sessionStorage.removeItem(CALLBACK_KEY);
    if (data && typeof data.code === 'string' && data.code) {
      return { code: data.code, state: data.state ?? '' };
    }
    return null;
  } catch {
    return null;
  }
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
    const dispatchCallback = (code: string, state: string) => {
      const expectedState = sessionStorage.getItem(STATE_KEY);
      if (expectedState && state && state !== expectedState) {
        console.warn('[GitHub OAuth] state mismatch (posible CSRF o tab refresh)');
      }
      sessionStorage.removeItem(STATE_KEY);
      if (code) {
        onSuccessRef.current(code);
      } else {
        onErrorRef.current?.('No se recibió code de GitHub');
      }
    };

    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; code?: string; state?: string; error?: string };
      if (!data || data.type !== 'github-oauth-callback') return;
      if (data.error) {
        onErrorRef.current?.(data.error);
        return;
      }
      if (data.code) {
        dispatchCallback(data.code, data.state ?? '');
      }
    };

    const storageHandler = (event: StorageEvent) => {
      if (event.key !== CALLBACK_KEY || !event.newValue) return;
      const data = readCallbackFromStorage();
      if (data) {
        dispatchCallback(data.code, data.state);
      }
    };

    const pollHandle = setInterval(() => {
      const data = readCallbackFromStorage();
      if (data) {
        dispatchCallback(data.code, data.state);
      }
    }, 300);

    window.addEventListener('message', messageHandler);
    window.addEventListener('storage', storageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
      window.removeEventListener('storage', storageHandler);
      clearInterval(pollHandle);
    };
  }, []);

  const handleClick = () => {
    if (!clientId) {
      onErrorRef.current?.('GitHub Client ID no configurado');
      return;
    }
    sessionStorage.removeItem(CALLBACK_KEY);
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
        <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.3a11.5 11.5 0 016 0c2.3-1.6 3.3-1.3 3.3-1.3.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3 1.2.1 1.6-.6 2.5-1.2 2.5-2.2 0-1.2 0-2.2-.1-2.5 0 0 .5-1.7 2-2.7 0 0 0-1.7-3.3-1.4 0 0-2.7.2-3.5 1.3 0 0-1 .1-2 .3-1.4 0-2.7.4-3.8 0-3.4 2.5-5.4 5.7-6 1.4-.3 2.6-.5 4-.5s2.6.2 4 .5c3.3-.4 6.1 2.6 5.7 6 .5 1.3.8 2.7.8 4.2 0 5-2.3 7.6-5.5 7.9.3.6.6 1.3.6 2.6v3.8c0 .3.2.7.8.6A12 12 0 0012 .3" />
      </svg>
      {label}
    </button>
  );
}
