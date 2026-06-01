import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as messagesApi from '@/lib/api/messages';
import type { Conversation, ConversationType, Message } from '@/app/types';

const CONVERSATIONS_KEY = 'conversations';
const MESSAGES_KEY = 'messages';

export function useConversations(userId?: string) {
  return useQuery({
    queryKey: [CONVERSATIONS_KEY, userId],
    queryFn: () => messagesApi.fetchConversations(userId),
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: [CONVERSATIONS_KEY, id],
    queryFn: () => messagesApi.fetchConversation(id),
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
    }) => messagesApi.createConversation(participants, propertyId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] });
    },
  });
}

export function useMessages(userId?: string) {
  return useQuery({
    queryKey: [MESSAGES_KEY, userId],
    queryFn: () => messagesApi.fetchMessages(userId),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) =>
      messagesApi.sendMessage(message),
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
      messagesApi.markMessagesRead(conversationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY] });
    },
  });
}
