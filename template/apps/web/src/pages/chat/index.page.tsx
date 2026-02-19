import { FC, useEffect } from 'react';
import Head from 'next/head';

import { ChatBox } from './components';
import { useChatManager } from './hooks';

interface ChatPageProps {
  chatId?: string;
}

const ChatPage: FC<ChatPageProps> = ({ chatId: initialChatId }) => {
  const { activeChatId, displayMessages, input, isLoading, setInput, loadMessages, handleSubmit } = useChatManager({
    initialChatId,
    onChatCreated: (chatId) => {
      window.history.replaceState(null, '', `/chat/${chatId}`);
    },
  });

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    }
  }, [activeChatId, loadMessages]);

  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>

      <div className="flex h-full">
        <div className="flex-1 p-4">
          <ChatBox
            messages={displayMessages.map((m) => ({ id: m._id, role: m.role, content: m.content }))}
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
