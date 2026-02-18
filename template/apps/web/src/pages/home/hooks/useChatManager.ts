import { useCallback, useRef, useState } from 'react';

import type { Chat, Message } from 'services/chats/chat.service';
import { chatService } from 'services/chats/chat.service';

interface UseChatManagerOptions {
  initialChatId?: string;
  onChatCreated?: (chatId: string) => void;
}

export const useChatManager = ({ initialChatId, onChatCreated }: UseChatManagerOptions = {}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId ?? null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const streamingContentRef = useRef('');

  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  const loadChats = useCallback(async () => {
    try {
      const loadedChats = await chatService.list();
      setChats(loadedChats);
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  }, []);

  const loadMessages = useCallback(
    async (chatId: string) => {
      if (messages[chatId]) return;

      try {
        const loadedMessages = await chatService.getMessages(chatId);
        setMessages((prev) => ({
          ...prev,
          [chatId]: loadedMessages,
        }));
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    },
    [messages],
  );

  const createChat = useCallback(async (): Promise<string | null> => {
    try {
      const newChat = await chatService.create('New Chat');
      setChats((prev) => [newChat, ...prev]);
      setMessages((prev) => ({ ...prev, [newChat._id]: [] }));
      setActiveChatId(newChat._id);
      onChatCreated?.(newChat._id);
      return newChat._id;
    } catch (error) {
      console.error('Failed to create chat:', error);
      return null;
    }
  }, [onChatCreated]);

  const deleteChat = useCallback(async (chatId: string): Promise<boolean> => {
    try {
      await chatService.delete(chatId);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      setMessages((prev) => {
        const newMessages = { ...prev };
        delete newMessages[chatId];
        return newMessages;
      });
      return true;
    } catch (error) {
      console.error('Failed to delete chat:', error);
      return false;
    }
  }, []);

  const addUserMessage = useCallback((chatId: string, content: string): Message => {
    const userMessage: Message = {
      _id: `temp-${Date.now()}`,
      chatId,
      role: 'user',
      content,
    };

    setMessages((prev) => ({
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
            setMessages((prev) => ({
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
            loadChats();
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
    [loadChats],
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
