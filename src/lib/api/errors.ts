export type AuthErrorKind = 'invalid_credentials' | 'account_locked' | 'rate_limit' | 'network' | 'unknown';

export interface AuthErrorData {
  kind: AuthErrorKind;
  status: number;
  message: string;
  intentosRestantes?: number;
  intentosFallidos?: number;
  blockedUntil?: string; // ISO date string
}

export class AuthError extends Error {
  readonly kind: AuthErrorKind;
  readonly status: number;
  readonly intentosRestantes?: number;
  readonly intentosFallidos?: number;
  readonly blockedUntil?: string;

  constructor(data: AuthErrorData) {
    super(data.message);
    this.name = 'AuthError';
    this.kind = data.kind;
    this.status = data.status;
    this.intentosRestantes = data.intentosRestantes;
    this.intentosFallidos = data.intentosFallidos;
    this.blockedUntil = data.blockedUntil;
  }

  isLocked(): boolean {
    return this.kind === 'account_locked';
  }
}

/** Parse a failed fetch response into an AuthError */
export async function parseAuthError(res: Response): Promise<AuthError> {
  let message = `Error ${res.status}`;
  let intentosRestantes: number | undefined;
  let intentosFallidos: number | undefined;
  let blockedUntil: string | undefined;

  try {
    const body = await res.json();
    if (body?.message) message = body.message;
    if (body?.intentosRestantes !== undefined) intentosRestantes = body.intentosRestantes;
    if (body?.intentosFallidos !== undefined) intentosFallidos = body.intentosFallidos;
    if (body?.blockedUntil) blockedUntil = body.blockedUntil;
  } catch {
    // Response wasn't JSON or had no body
  }

  let kind: AuthErrorKind;
  if (res.status === 429) {
    kind = 'account_locked';
  } else if (res.status === 401) {
    kind = 'invalid_credentials';
  } else if (res.status === 0 || res.status === 503) {
    kind = 'network';
  } else {
    kind = 'unknown';
  }

  return new AuthError({ kind, status: res.status, message, intentosRestantes, intentosFallidos, blockedUntil });
}