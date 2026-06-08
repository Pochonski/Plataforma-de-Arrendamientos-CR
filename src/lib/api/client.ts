import { toast } from 'sonner';

export const API_BASE = import.meta.env.VITE_API_URL || '';
export const APIM_URL = import.meta.env.VITE_APIM_URL || '';
export const APIM_KEY = import.meta.env.VITE_APIM_SUBSCRIPTION_KEY || '';

type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  headers?: Record<string, string>;
  baseUrl?: string;
};

const FUN_MESSAGES: Record<number, string[]> = {
  0: [
    '🚨 El microservicio de usuarios ha decidido tomarse un café...',
    '💤 Ups, parece que el backend está en modo siesta',
    '🔌 Alguien desconectó el cable de red — o el profe anduvo jueguito',
    '🌴 El servidor está de vacaciones en la playa de Tamarindo',
    '☕ El backend dice: "¡Ya vuelvo!" (llevo 5 minutos)...',
  ],
  401: [
    '🔐 Tu sesión expiró como el pan dulce en diciembre',
    '🚪 El backend te dijo "ya no te conozco"',
    '⏰ Tu token caducó más rápido que la electricidad en Costa Rica',
  ],
  403: [
    '🚫 No, no y no. El backend dice que no tienes permiso ni para entrar',
    '🙅 "¿Quién eres y por qué estás aquí?" — backend, 2026',
  ],
  404: [
    '🔍 No encontramos nada... ni siquiera en el sótano del servidor',
    '🫥 El recurso se fue a fumar y no ha vuelto',
  ],
  429: [
    '⏳ ¡Calma, cowboy! El rate limit dijo: "Ya fue mucho"',
    '🐢 El backend está protegiendo sus recursos, ve más lento',
  ],
  500: [
    '💥 El servidor tropezó y nadie sabe cómo levantarlo',
    '🔥 El backend está en llamas (metafóricamente) y nadie llama a los bomberos',
    '🌀 Error 500: El caos reinó en el servidor principal',
  ],
  502: [
    '🎭 El API Gateway se cayó y nadie sabe quién tiene la culpa',
    '🌉 El puente entre servicios se rompió — puro drama de microservicios',
  ],
  503: [
    '🚧 El backend está en mantenimiento, vuelva pronto (quizá mañana)',
    '🏗️ El servidor está siendo reconstruido mientras hablamos',
  ],
};

const FALLBACK_MESSAGES = [
  '🤷 Algo salió mal y no sabemos qué. Ni el backend sabe qué pasó',
  '❓ El error existe pero sus causas son un misterio para la humanidad',
  '🎲 Los dados del destino cayeron mal — inténtalo de nuevo',
  '📦 El paquete se perdió en el camino, como los calcetines en la lavadora',
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
  const { baseUrl, headers: extraHeaders, ...rest } = options;
  const resolvedBase = baseUrl ?? APIM_URL ?? API_BASE;
  const url = `${resolvedBase}${path}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  if (APIM_KEY) headers['Ocp-Apim-Subscription-Key'] = APIM_KEY;

  const config: RequestInit = {
    ...rest,
    headers,
  };
  if (rest.body && typeof rest.body !== 'string') {
    config.body = JSON.stringify(rest.body);
  }

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
