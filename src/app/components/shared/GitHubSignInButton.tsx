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
        <path d="M15 22v-4a4.8 4.8 0 00-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 004 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
      </svg>
      {label}
    </button>
  );
}
