import { FC, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChatBox, ChatSidebar } from 'pages/home/components/chat';
import { useChatManager } from 'pages/home/hooks';

interface ChatPageProps {
  chatId?: string;
}

const ChatPage: FC<ChatPageProps> = ({ chatId: initialChatId }) => {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    chats,
    activeChatId,
    displayMessages,
    input,
    isLoading,
    setInput,
    loadChats,
    loadMessages,
    deleteChat,
    handleSubmit,
    resetChat,
  } = useChatManager({
    initialChatId,
    onChatCreated: (chatId) => {
      window.history.replaceState(null, '', `/chat/${chatId}`);
    },
  });

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    }
  }, [activeChatId, loadMessages]);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      router.push(`/chat/${chatId}`);
    },
    [router],
  );

  const handleNewChat = useCallback(() => {
    resetChat();
    router.push('/chat');
  }, [router, resetChat]);

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      const deleted = await deleteChat(chatId);
      if (deleted && activeChatId === chatId) {
        router.push('/chat');
      }
    },
    [activeChatId, router, deleteChat],
  );

  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>

      <div className="flex h-full">
        <ChatSidebar
          chats={chats.map((c) => ({
            id: c._id,
            title: c.title,
            updatedOn: c.updatedOn ? new Date(c.updatedOn) : undefined,
          }))}
          activeChatId={activeChatId}
          isCollapsed={isSidebarCollapsed}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

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
