import { useQuery } from '@tanstack/react-query';

import { apiService } from 'services';

import { AiChat, ApiError, ChatListResult } from 'types';

export const useList = (options = {}) =>
  useQuery<ChatListResult<AiChat>>({
    queryKey: ['chatsList'],
    queryFn: () => apiService.get('/open-ai/list'),
    staleTime: 5 * 1000,
    ...options,
  });

export const useSelectedChat = ({ chatId }: { chatId: string | null }) =>
  useQuery<AiChat, ApiError>({
    queryKey: ['selectedChat', chatId],
    queryFn: () => apiService.get(`/open-ai/chat/${chatId}`),
    enabled: !!chatId,
  });
