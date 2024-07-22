import { useCallback, useState } from 'react';

import queryClient from 'query-client';
import config from 'config';

import { AIMessage, ChatRoleType } from 'types';

const { API_URL } = config;

interface ChatDataParams {
  requestTextValue: string;
  chatId: string | null;
}

interface UseChatDataResult {
  fetchData: (params: ChatDataParams) => Promise<void>;
  isLoading: boolean;
  streamParts: string[];
}

const useChatData = (
  onChatSelect: (chatId: string | null) => void,
  addLocalMessage: (message: AIMessage) => void,
): UseChatDataResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [streamParts, setStreamParts] = useState<string[]>([]);

  const fetchData = useCallback(
    async ({ requestTextValue, chatId }: { requestTextValue: string; chatId: string | null }) => {
      if (!requestTextValue.trim() || isLoading) return;

      let hasReceivedData = false;
      let receivedChatId: string | null = null;

      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/open-ai/chat`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: requestTextValue, ...(chatId && { chatId }) }),
        });

        if (!response.body) {
          console.error('No response body');
          return;
        }

        receivedChatId = response.headers.get('x-chat-id');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const tempDynamicMessage: string[] = [];
        let done = false;

        while (!done) {
          // eslint-disable-next-line no-await-in-loop
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            tempDynamicMessage.push(chunk);
            setStreamParts((prevParts) => [...prevParts, chunk]);

            if (!hasReceivedData) {
              hasReceivedData = true;
              setIsLoading(false);
            }
          }

          if (readerDone) {
            addLocalMessage({
              role: ChatRoleType.ASSISTANT,
              content: tempDynamicMessage.join(''),
              id: crypto.randomUUID(),
            });
            setStreamParts([]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (hasReceivedData) {
          setIsLoading(false);
          await queryClient.invalidateQueries({ queryKey: ['chatsList'] });
          onChatSelect(receivedChatId);
        }
      }
    },
    [isLoading, onChatSelect, addLocalMessage],
  );

  return { fetchData, isLoading, streamParts };
};

export default useChatData;
