/**
 * Hook de Socket.io para mensajería en tiempo real.
 *
 * Flujo:
 *   1. Se conecta a VITE_SOCKET_URL (ms-mensajes) usando transport websocket.
 *   2. Al establecerse la conexión, emite el evento 'autenticar' con el userId
 *      para unirse a la sala privada del usuario.
 *   3. Escucha el evento 'nuevo_mensaje' y llama al callback `onNuevoMensaje`.
 *
 * El hook se reconecta automáticamente hasta 5 veces si la conexión se pierde.
 * Si VITE_SOCKET_URL no está configurada, no hace nada (graceful degradation).
 */
import { useEffect, useRef, useState, useCallback } from 'react';
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
  /** ID del usuario autenticado. El hook solo se activa cuando no es null. */
  userId: string | null;
  /** Callback invocado cada vez que llega un evento 'nuevo_mensaje'. */
  onNuevoMensaje?: (payload: NuevoMensajePayload) => void;
}

interface UseSocketReturn {
  /** true cuando la conexión Socket.io está establecida y el usuario autenticado. */
  connected: boolean;
}

export function useSocket({ userId, onNuevoMensaje }: UseSocketOptions): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Usar ref para el callback para evitar stale closures sin re-crear el efecto
  const callbackRef = useRef(onNuevoMensaje);
  useEffect(() => {
    callbackRef.current = onNuevoMensaje;
  }, [onNuevoMensaje]);

  useEffect(() => {
    if (!userId || !SOCKET_URL) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Conectado:', socket.id);
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
  }, [userId]); // Solo re-crea si cambia el userId

  return { connected };
}
