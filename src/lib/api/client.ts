export const API_BASE = import.meta.env.VITE_API_URL || '';
export const APIM_URL = import.meta.env.VITE_APIM_URL || '';
export const APIM_KEY = import.meta.env.VITE_APIM_SUBSCRIPTION_KEY || '';

type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  headers?: Record<string, string>;
  baseUrl?: string;
};

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

  const res = await fetch(url, config);
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
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
