import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation, useApiQuery } from 'hooks/use-api.hook';
import { Message } from 'shared';

import { apiClient } from 'services/api-client.service';
import { chatService } from 'services/chats/chat.service';

interface UseChatManagerOptions {
  initialChatId?: string;
  onChatCreated?: (chatId: string) => void;
}

export const useChatManager = ({ initialChatId, onChatCreated }: UseChatManagerOptions = {}) => {
  const queryClient = useQueryClient();
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId ?? null);
  const [messagesCache, setMessagesCache] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const streamingContentRef = useRef('');

  const { data: chats = [], refetch: refetchChats } = useApiQuery(apiClient.chats.list);

  const createChatMutation = useApiMutation(apiClient.chats.create, {
    onSuccess: () => refetchChats(),
  });

  const activeMessages = activeChatId ? messagesCache[activeChatId] || [] : [];

  const loadChats = useCallback(() => {
    refetchChats();
  }, [refetchChats]);

  const loadMessages = useCallback(
    async (chatId: string) => {
      if (messagesCache[chatId]) return;

      try {
        const messages = await apiClient.chats.getMessages.call({}, { pathParams: { chatId } });
        setMessagesCache((prev) => ({
          ...prev,
          [chatId]: messages,
        }));
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    },
    [messagesCache],
  );

  const createChat = useCallback(async (): Promise<string | null> => {
    try {
      const newChat = await createChatMutation.mutateAsync({ title: 'New Chat' });
      setMessagesCache((prev) => ({ ...prev, [newChat._id]: [] }));
      setActiveChatId(newChat._id);
      onChatCreated?.(newChat._id);
      return newChat._id;
    } catch (error) {
      console.error('Failed to create chat:', error);
      return null;
    }
  }, [createChatMutation, onChatCreated]);

  const deleteChat = useCallback(
    async (chatId: string): Promise<boolean> => {
      try {
        await apiClient.chats.delete.call({}, { pathParams: { chatId } });
        queryClient.invalidateQueries({ queryKey: [apiClient.chats.list.path] });
        setMessagesCache((prev) => {
          const newMessages = { ...prev };
          delete newMessages[chatId];
          return newMessages;
        });
        return true;
      } catch (error) {
        console.error('Failed to delete chat:', error);
        return false;
      }
    },
    [queryClient],
  );

  const addUserMessage = useCallback((chatId: string, content: string): Message => {
    const userMessage: Message = {
      _id: `temp-${Date.now()}`,
      chatId,
      role: 'user',
      content,
    };

    setMessagesCache((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), userMessage],
    }));

    return userMessage;
  }, []);

  const sendMessage = useCallback(
    async (chatId: string, content: string) => {
      setIsLoading(true);
      streamingContentRef.current = '';
      setStreamingContent('');

      try {
        await chatService.sendMessage(chatId, content, {
          onToken: (token) => {
            streamingContentRef.current += token;
            setStreamingContent(streamingContentRef.current);
          },
          onDone: (messageId) => {
            const finalContent = streamingContentRef.current;
            setMessagesCache((prev) => ({
              ...prev,
              [chatId]: [
                ...(prev[chatId] || []),
                {
                  _id: messageId,
                  chatId,
                  role: 'assistant',
                  content: finalContent,
                },
              ],
            }));
            streamingContentRef.current = '';
            setStreamingContent('');
            setIsLoading(false);
            refetchChats();
          },
          onError: (error) => {
            console.error('AI error:', error);
            streamingContentRef.current = '';
            setStreamingContent('');
            setIsLoading(false);
          },
        });
      } catch (error) {
        console.error('Failed to send message:', error);
        setIsLoading(false);
      }
    },
    [refetchChats],
  );

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    let chatId = activeChatId;

    if (!chatId) {
      chatId = await createChat();
      if (!chatId) return;
    }

    const content = input.trim();
    setInput('');

    addUserMessage(chatId, content);
    await sendMessage(chatId, content);
  }, [input, isLoading, activeChatId, createChat, addUserMessage, sendMessage]);

  const resetChat = useCallback(() => {
    setActiveChatId(null);
    setInput('');
    setStreamingContent('');
  }, []);

  const displayMessages = activeChatId
    ? [
        ...activeMessages,
        ...(streamingContent
          ? [
              {
                _id: 'streaming',
                chatId: activeChatId,
                role: 'assistant' as const,
                content: streamingContent,
              },
            ]
          : []),
      ]
    : [];

  return {
    // State
    chats,
    activeChatId,
    activeMessages,
    displayMessages,
    input,
    isLoading,
    streamingContent,

    // Setters
    setActiveChatId,
    setInput,

    // Actions
    loadChats,
    loadMessages,
    createChat,
    deleteChat,
    handleSubmit,
    resetChat,
  };
};
