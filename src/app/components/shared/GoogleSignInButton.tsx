import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string; select_by?: string }) => void;
            nonce?: string;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            itp_support?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (parent: HTMLElement, options: {
            type?: 'standard' | 'icon';
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
            logo_alignment?: 'left' | 'center';
            width?: number;
            locale?: string;
          }) => void;
          prompt: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

export interface GoogleSignInButtonProps {
  clientId: string;
  nonce: string;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  onSuccess: (credential: string) => void;
  onError?: (message: string) => void;
}

const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let scriptLoadingPromise: Promise<void> | null = null;

function ensureGsiScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load GSI script')));
      return;
    }
    const script = document.createElement('script');
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load GSI script'));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export function GoogleSignInButton({
  clientId,
  nonce,
  text = 'signin_with',
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clientId) {
      onError?.('Google Client ID no configurado');
      return;
    }

    let cancelled = false;

    ensureGsiScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          nonce,
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true,
          use_fedcm_for_prompt: false,
          callback: (response) => {
            if (response?.credential) {
              onSuccess(response.credential);
            } else {
              onError?.('No se recibió credential de Google');
            }
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 240,
          locale: 'es',
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Error cargando GSI';
        onError?.(message);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, nonce, text, onSuccess, onError]);

  return <div ref={buttonRef} className="flex justify-center" />;
}
