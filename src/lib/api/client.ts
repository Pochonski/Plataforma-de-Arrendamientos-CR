import { toast } from 'sonner';

export const API_BASE = import.meta.env.VITE_API_URL || '';
export const APIM_URL = import.meta.env.VITE_APIM_URL || '';
export const APIM_KEY = import.meta.env.VITE_APIM_SUBSCRIPTION_KEY || '';

export const BACKEND_USUARIOS = import.meta.env.VITE_BACKEND_USUARIOS || '';
export const BACKEND_PROPIEDADES = import.meta.env.VITE_BACKEND_PROPIEDADES || 'https://ms-propiedades.azurewebsites.net';
export const BACKEND_CONTRATOS_PAGOS = import.meta.env.VITE_BACKEND_CONTRATOS_PAGOS || 'https://ms-contratos-pagos.azurewebsites.net';
export const BACKEND_MENSAJES = import.meta.env.VITE_BACKEND_MENSAJES || 'https://ms-mensajes.azurewebsites.net';
export const BACKEND_NOTIFICACIONES = import.meta.env.VITE_BACKEND_NOTIFICACIONES || 'https://ms-notificaciones.azurewebsites.net';

/**
 * Prefijo común para todos los endpoints REST del backend.
 * En prod (SWA + linked backend) el SWA proxia `<host>/api/*` al App Service,
 * así que el cliente siempre pega `/api/...` y el browser ve mismo-origen.
 * Override por env: `VITE_API_PREFIX` (ej. '' para hablarle directo al App Service).
 */
export const API_PREFIX = import.meta.env.VITE_API_PREFIX ?? '/api';

export const AUTH_TOKEN_KEY = 'auth_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  headers?: Record<string, string>;
  baseUrl?: string;
};

const FUN_MESSAGES: Record<number, string[]> = {
  0: [
    '🚨 El microservicio decidió tomarse un café... sin avisar',
    '💤 Backend en modo siesta — arquitectura de microservicios en acción 👀',
    '🔌 Alguien desconectó el cable — o el profe apagó ese micro a propósito',
    '🌴 Este servicio está de vacaciones en Tamarindo, sin señal, sin respuestas',
    '☕ El microservicio dice "ya vuelvo" — lleva 5 minutos',
    '👨‍🏫 Diagnóstico probable: el profe apagó este micro para ver si aguantamos. Aguantamos.',
    '🧩 Un micro cayó. Los demás siguen. Eso era exactamente el punto del diseño.',
  ],
  401: [
    '🔐 Tu sesión expiró como el pan dulce en diciembre',
    '🚪 El backend te dijo "ya no te conozco"',
    '⏰ Tu token caducó más rápido que la electricidad en Costa Rica',
    '🪪 Sin credenciales válidas — igual que intentar entrar al BCCR sin cita',
  ],
  403: [
    '🚫 No, no y no. Sin permiso ni para mirar',
    '🙅 "¿Quién eres y por qué estás aquí?" — backend, 2026',
    '🔒 Acceso denegado. Ni con palanca.',
  ],
  404: [
    '🔍 No encontramos nada... ni en el sótano del servidor',
    '🫥 El recurso se fue y no dejó nota',
    '📭 Aquí no vive nadie. Nunca vivió.',
  ],
  429: [
    '⏳ ¡Calma! El rate limit dijo: "Ya fue mucho por hoy"',
    '🐢 El backend está protegiendo sus recursos, andá más suave',
    '🛑 Demasiadas solicitudes. El servidor se cansó antes que vos.',
  ],
  500: [
    '💥 El servidor tropezó y nadie sabe cómo levantarlo',
    '🔥 Backend en llamas (metafórico) — nadie llama a los bomberos',
    '🌀 Error 500: el caos reinó en el servidor principal',
    '😵 El microservicio entró en crisis existencial. Hay que darle tiempo.',
  ],
  502: [
    '🎭 El API Gateway se cayó y nadie sabe de quién es la culpa',
    '🌉 El puente entre servicios se rompió — drama de microservicios nivel experto',
    '📡 El APIM no encontró a quién reenviarle la solicitud. Silencio total.',
  ],
  503: [
    '🚧 Servicio no disponible — vuelva pronto (quizás mañana)',
    '🏗️ El servidor está siendo reconstruido mientras hablamos',
    '🧑‍🔧 503: el micro está en mantenimiento o el profe lo apagó para la demo. Ambas son válidas.',
  ],
};

const FALLBACK_MESSAGES = [
  '🤷 Algo salió mal y ni el backend sabe qué fue',
  '❓ El error existe pero sus causas son un misterio para la humanidad entera',
  '🎲 Los dados del destino cayeron mal — inténtalo de nuevo',
  '📦 El paquete se perdió, como los calcetines en la lavadora',
  '🪲 Bug no identificado. Podría ser el profe. Podría ser el universo.',
];

function getFunMessage(status: number, isNetworkError: boolean): string {
  if (isNetworkError) {
    const msgs = FUN_MESSAGES[0];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  const msgs = FUN_MESSAGES[status] || FALLBACK_MESSAGES;
  return msgs[Math.floor(Math.random() * msgs.length)];
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { baseUrl, headers: extraHeaders, body, ...rest } = options;
  const resolvedBase = baseUrl ?? APIM_URL ?? API_BASE;
  const isAbsolute = /^https?:\/\//i.test(resolvedBase);
  const normalizedPath = isAbsolute || path.startsWith(API_PREFIX)
    ? path
    : `${API_PREFIX}${path}`;
  const url = `${resolvedBase}${normalizedPath}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  if (APIM_KEY) headers['Ocp-Apim-Subscription-Key'] = APIM_KEY;
  const hasAuth = typeof headers['Authorization'] === 'string' && headers['Authorization'].length > 0;
  if (!hasAuth) {
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...rest,
    headers,
    body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const msg = getFunMessage(res.status, false);
      // 401 lo maneja el AuthContext (redirige al login) — no duplicar toast
      if (res.status !== 401) {
        toast.error(msg);
      }
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      toast.error(getFunMessage(0, true));
    }
    throw err;
  }
}

export const api = {
  get: <T>(path: string, baseUrl?: string, headers?: Record<string, string>) =>
    apiFetch<T>(path, { baseUrl, headers }),

  post: <T>(path: string, body: unknown, baseUrl?: string, headers?: Record<string, string>) =>
    apiFetch<T>(path, { method: 'POST', body, baseUrl, headers }),

  put: <T>(path: string, body: unknown, baseUrl?: string, headers?: Record<string, string>) =>
    apiFetch<T>(path, { method: 'PUT', body, baseUrl, headers }),

  delete: <T>(path: string, baseUrl?: string, headers?: Record<string, string>) =>
    apiFetch<T>(path, { method: 'DELETE', baseUrl, headers }),
};
