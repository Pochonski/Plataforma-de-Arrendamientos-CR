import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConversations, fetchConversation, createConversation, fetchMessages, sendMessage, markMessagesRead } from '@/lib/api/messages';
import type { Conversation, ConversationType, Message } from '@/app/types';

const CONVERSATIONS_KEY = 'conversations';
const MESSAGES_KEY = 'messages';

export function useConversations(userId?: string) {
  return useQuery({
    queryKey: [CONVERSATIONS_KEY, userId],
    queryFn: () => fetchConversations(userId),
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: [CONVERSATIONS_KEY, id],
    queryFn: () => fetchConversation(id),
    enabled: !!id,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      participants,
      propertyId,
      type,
    }: {
      participants: string[];
      propertyId: string;
      type: ConversationType;
    }) => createConversation(participants, propertyId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] });
    },
  });
}

export function useMessages(userId?: string) {
  return useQuery({
    queryKey: [MESSAGES_KEY, userId],
    queryFn: () => fetchMessages(userId),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) =>
      sendMessage(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] });
    },
  });
}

export function useMarkMessagesRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, userId }: { conversationId: string; userId: string }) =>
      markMessagesRead(conversationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] });
    },
  });
}
