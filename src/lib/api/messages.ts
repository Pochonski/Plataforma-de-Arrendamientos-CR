import { api } from './client';
import { normalizeMessage, normalizeConversation } from './normalize';
import type { Conversation, ConversationType, Message } from '@/app/types';

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

export async function fetchConversations(userId?: string): Promise<Conversation[]> {
  const endpoint = userId ? `/conversaciones/${userId}` : '/conversaciones';
  const data = await api.get(endpoint);
  let normalized = Array.isArray(data) ? data.map(normalizeConversation) : [];

  if (userId) {
    normalized = normalized.filter(c => c.participants.includes(userId));
  }
  return normalized;
}

export async function fetchConversation(id: string): Promise<Conversation> {
  const raw = await api.get(`/conversaciones/${id}`);
  return normalizeConversation(raw);
}

export async function createConversation(
  participants: string[],
  propertyId: string,
  type: ConversationType,
): Promise<Conversation> {
  const raw = await api.post('/conversaciones', { participants, propertyId, type });
  return normalizeConversation(raw);
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function fetchMessages(userId?: string): Promise<Message[]> {
  const endpoint = userId ? `/mensajes/${userId}` : '/mensajes';
  const data = await api.get(endpoint);
  let normalized = Array.isArray(data) ? data.map(normalizeMessage) : [];

  if (userId) {
    normalized = normalized.filter(m => m.senderId === userId || m.receiverId === userId);
  }
  return normalized;
}

export async function fetchMessage(id: string): Promise<Message> {
  const raw = await api.get(`/mensajes/${id}`);
  return normalizeMessage(raw);
}

export async function sendMessage(
  message: Omit<Message, 'id' | 'timestamp' | 'status'>,
): Promise<Message> {
  const raw = await api.post('/mensajes', message);
  return normalizeMessage(raw);
}

export async function markMessagesRead(conversationId: string, userId: string): Promise<void> {
  const allMessages = await fetchMessages();
  const unread = allMessages.filter(
    msg => msg.conversationId === conversationId &&
      msg.receiverId === userId &&
      msg.status !== 'read',
  );

  await Promise.all(unread.map(async (msg) => {
    try {
      await api.put(`/mensajes/${msg.id}`, { status: 'read' });
    } catch {
      // Silently ignore per-message failures (matching DataContext behavior)
    }
  }));
}
