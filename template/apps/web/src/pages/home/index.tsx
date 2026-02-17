import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import type { Chat, Message } from './components/chat';
import { ChatBox, ChatSidebar } from './components/chat';

const Home: NextPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [isLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setInput('');
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: `${Date.now()}`,
      title: 'New Chat',
      updatedOn: new Date(),
    };
    setChats([newChat, ...chats]);
    setMessages({ ...messages, [newChat.id]: [] });
    setActiveChatId(newChat.id);
    setInput('');
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(chats.filter((c) => c.id !== chatId));
    const newMessages = { ...messages };
    delete newMessages[chatId];
    setMessages(newMessages);
    if (activeChatId === chatId) {
      setActiveChatId(chats[0]?.id !== chatId ? chats[0]?.id : chats[1]?.id || null);
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || !activeChatId) return;

    const userMessage: Message = {
      id: `${activeChatId}-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), userMessage],
    }));

    if (!messages[activeChatId]?.length) {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, title: input.trim().slice(0, 30), updatedOn: new Date() } : c,
        ),
      );
    }

    setInput('');
    // TODO: Integrate with AI API
  };

  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>

      <div className="flex h-full">
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          isCollapsed={isSidebarCollapsed}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div className="flex-1 p-4">
          <ChatBox
            messages={activeMessages}
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

export default Home;
