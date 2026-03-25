import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';

import { LayoutType, Page, ScopeType } from 'components';
import { useApiQuery, useApiMutation, useQueryClient, queryKey } from 'hooks';
import { apiClient } from 'services/api-client.service';

import { AiChatBox } from './components';
import type { AiChatDisplayMessage } from './components';

interface AiChatPageProps {
  chatId?: string;
}

const AiChatPage = ({ chatId: initialChatId }: AiChatPageProps) => {
  const queryClient = useQueryClient();
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId ?? null);
  const [messages, setMessages] = useState<AiChatDisplayMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [input, setInput] = useState('');

  const createChatMutation = useApiMutation(apiClient['ai-chats'].create, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(apiClient['ai-chats'].list) });
    },
  });

  const sendMessageMutation = useApiMutation(apiClient['ai-chats'].sendMessage, {
    onSuccess: (data) => {
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => !m.id.startsWith('temp-'));
        return [
          ...withoutOptimistic,
          { id: data.userMessage.id, role: data.userMessage.role, content: data.userMessage.content },
          { id: data.assistantMessage.id, role: data.assistantMessage.role, content: data.assistantMessage.content },
        ];
      });
      queryClient.invalidateQueries({ queryKey: queryKey(apiClient['ai-chats'].list) });
    },
    onError: () => {
      setMessages((prev) => prev.filter((m) => !m.id.startsWith('temp-')));
    },
  });

  const loadMessages = useCallback(
    async (chatId: string) => {
      setIsLoadingMessages(true);
      try {
        const result = await apiClient['ai-chats'].getMessages({ chatId });
        setMessages(
          result.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          })),
        );
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    }
  }, [activeChatId, loadMessages]);

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || sendMessageMutation.isPending) return;

    const content = input.trim();
    setInput('');

    let chatId = activeChatId;

    if (!chatId) {
      try {
        const newChat = await createChatMutation.mutateAsync({ title: 'New Chat' });
        chatId = newChat.id;
        setActiveChatId(chatId);
        window.history.replaceState(null, '', `/ai-chat/${chatId}`);
      } catch {
        return;
      }
    }

    setMessages((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, role: 'user', content },
    ]);

    sendMessageMutation.mutate({ chatId, content });
  }, [input, activeChatId, sendMessageMutation, createChatMutation]);

  return (
    <>
      <Head>
        <title>AI Chat</title>
      </Head>

      <div className="flex h-full">
        <div className="flex-1">
          <AiChatBox
            messages={messages}
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            isLoading={sendMessageMutation.isPending}
            isLoadingMessages={isLoadingMessages && !!initialChatId}
          />
        </div>
      </div>
    </>
  );
};

export { AiChatPage };

const AiChatIndexPage = () => (
  <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
    <AiChatPage />
  </Page>
);

export default AiChatIndexPage;
