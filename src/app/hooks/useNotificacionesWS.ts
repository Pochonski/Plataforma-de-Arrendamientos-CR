/**
 * Hook de WebSocket nativo para notificaciones en tiempo real.
 *
 * Flujo:
 *   1. Se conecta a wss://{VITE_NOTIF_WS_URL}/ws/{userId}?token={jwt}
 *   2. Envía "ping" cada 30 s para mantener la conexión activa (el servidor responde "pong").
 *   3. Recibe mensajes JSON y llama al callback `onNotificacion`.
 *   4. Si se pierde la conexión (excepto por token inválido / no autorizado), reconecta
 *      automáticamente con back-off exponencial.
 *
 * Codes de cierre que NO reconectan:
 *   4001 — token inválido
 *   4003 — token no coincide con el usuario solicitado
 *   1000 — cierre voluntario (unmount)
 *
 * Si VITE_NOTIF_WS_URL no está configurada, el hook no hace nada.
 */
import { useEffect, useRef, useState, useCallback } from 'react';

const WS_BASE = import.meta.env.VITE_NOTIF_WS_URL || '';

/** Payload JSON enviado por ms-notificaciones cuando procesa un evento de Service Bus */
export interface NotificacionWS {
  id: string;
  usuario_id: string;
  tipo: string;
  titulo: string;
  cuerpo: string;
  metadata: Record<string, unknown>;
  leida: boolean;
  creada_en: string; // ISO string
}

interface UseNotificacionesWSOptions {
  /** ID del usuario autenticado. El hook solo se activa cuando no es null. */
  userId: string | null;
  /** JWT HS256 con claim sub=userId. Requerido por el servidor. */
  token: string | null;
  /** Callback invocado cada vez que llega una notificación desde el WebSocket. */
  onNotificacion: (notif: NotificacionWS) => void;
}

interface UseNotificacionesWSReturn {
  /** true cuando la conexión WebSocket está abierta. */
  connected: boolean;
}

const PING_INTERVAL_MS = 30_000;
const BASE_RECONNECT_MS = 3_000;
const MAX_RECONNECT_MS = 60_000;

export function useNotificacionesWS({
  userId,
  token,
  onNotificacion,
}: UseNotificacionesWSOptions): UseNotificacionesWSReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelayRef = useRef(BASE_RECONNECT_MS);
  const mountedRef = useRef(true);
  const [connected, setConnected] = useState(false);

  // Mantener referencia al callback para evitar stale closures
  const callbackRef = useRef(onNotificacion);
  useEffect(() => {
    callbackRef.current = onNotificacion;
  }, [onNotificacion]);

  const clearTimers = useCallback(() => {
    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!userId || !token || !WS_BASE || !mountedRef.current) return;

    // Limpiar conexión anterior si existe
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close(1000, 'Reconnecting');
    }
    clearTimers();

    const url = `wss://${WS_BASE}/ws/${encodeURIComponent(userId)}?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      console.log('[WS Notif] Conectado');
      setConnected(true);
      reconnectDelayRef.current = BASE_RECONNECT_MS; // resetear back-off

      pingTimerRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
        }
      }, PING_INTERVAL_MS);
    };

    ws.onmessage = (event) => {
      const data = event.data;
      if (data === 'pong') return; // respuesta al ping, ignorar

      try {
        const notif: NotificacionWS = JSON.parse(data);
        callbackRef.current(notif);
      } catch {
        console.warn('[WS Notif] Mensaje no JSON recibido:', data);
      }
    };

    ws.onclose = (event) => {
      if (!mountedRef.current) return;
      setConnected(false);
      clearTimers();
      console.log(`[WS Notif] Cerrado. Código: ${event.code}, razón: ${event.reason}`);

      // No reconectar si el cierre fue voluntario o por token inválido
      const noReconnect = event.code === 1000 || event.code === 4001 || event.code === 4003;
      if (!noReconnect) {
        // Reconectar con back-off exponencial
        const delay = Math.min(reconnectDelayRef.current, MAX_RECONNECT_MS);
        reconnectDelayRef.current = Math.min(delay * 2, MAX_RECONNECT_MS);
        console.log(`[WS Notif] Reconectando en ${delay / 1000}s...`);
        reconnectTimerRef.current = setTimeout(() => {
          if (mountedRef.current) connect();
        }, delay);
      }
    };

    ws.onerror = () => {
      console.error('[WS Notif] Error de WebSocket');
    };
  }, [userId, token, clearTimers]);

  useEffect(() => {
    mountedRef.current = true;

    if (userId && token && WS_BASE) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      clearTimers();
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
        wsRef.current = null;
      }
      setConnected(false);
    };
  }, [userId, token, connect, clearTimers]);

  return { connected };
}
