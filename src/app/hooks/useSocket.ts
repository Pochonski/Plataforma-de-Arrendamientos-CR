/**
 * Hook de Socket.io para mensajería en tiempo real.
 *
 * Seguridad:
 *   - El JWT se envía en socket.handshake.auth.token (no en el body del evento).
 *   - ms-mensajes valida el token en un middleware `io.use()` y deriva el userId
 *     del claim `sub` del token — el servidor NUNCA confía en el userId enviado
 *     por el cliente en el evento 'autenticar'.
 *   - Si no hay token, el hook no crea la conexión (fail-closed).
 *
 * Flujo:
 *   1. Conecta a VITE_SOCKET_URL con { auth: { token } }.
 *   2. Al establecerse la conexión, emite 'autenticar' para que el servidor una
 *      la sala (el servidor ignora el userId del evento y usa el del token).
 *   3. Escucha 'nuevo_mensaje' y llama al callback onNuevoMensaje.
 *
 * Reconexión automática: hasta 5 intentos con backoff 2 s → 10 s.
 * Si VITE_SOCKET_URL no está configurada, no hace nada (graceful degradation).
 */
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

/** Payload del evento 'nuevo_mensaje' emitido por ms-mensajes */
export interface NuevoMensajePayload {
  mensaje_id: string;
  conversacion_id: string;
  remitente_id: string;
  remitente_nombre: string;
  contenido: string;
  enviado_en: string; // ISO string
}

interface UseSocketOptions {
  /** ID del usuario autenticado (solo para el evento legacy 'autenticar'). */
  userId: string | null;
  /**
   * JWT HS256 emitido tras el login (claim sub=userId).
   * Se envía en socket.handshake.auth.token para que el servidor verifique
   * la identidad. Si es null, el hook no crea la conexión.
   */
  token: string | null;
  /** Callback invocado cada vez que llega un evento 'nuevo_mensaje'. */
  onNuevoMensaje?: (payload: NuevoMensajePayload) => void;
}

interface UseSocketReturn {
  /** true cuando la conexión Socket.io está establecida y autenticada por el servidor. */
  connected: boolean;
}

export function useSocket({ userId, token, onNuevoMensaje }: UseSocketOptions): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Ref para el callback — evita stale closures sin re-crear el efecto
  const callbackRef = useRef(onNuevoMensaje);
  useEffect(() => {
    callbackRef.current = onNuevoMensaje;
  }, [onNuevoMensaje]);

  useEffect(() => {
    // No conectar si faltan credenciales o URL
    if (!userId || !token || !SOCKET_URL) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      // JWT en el handshake — el servidor lo valida en io.use() y extrae el userId
      // del claim `sub`. El cliente no puede hacerse pasar por otro usuario.
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Conectado:', socket.id);
      // Emitir 'autenticar' para que el servidor una la sala.
      // El servidor ignora el userId enviado aquí y usa el del token JWT.
      socket.emit('autenticar', userId);
    });

    socket.on('autenticado', (data: { mensaje: string }) => {
      console.log('[Socket] Autenticado:', data.mensaje);
      setConnected(true);
    });

    socket.on('nuevo_mensaje', (payload: NuevoMensajePayload) => {
      callbackRef.current?.(payload);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Desconectado:', reason);
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Error de conexión:', err.message);
      setConnected(false);
    });

    socket.on('error', (err: { mensaje?: string }) => {
      console.error('[Socket] Error del servidor:', err.mensaje);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [userId, token]); // Re-crea si cambia el usuario o el token

  return { connected };
}
