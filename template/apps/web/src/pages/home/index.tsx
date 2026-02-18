import { useCallback, useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import type { Chat, Message } from 'services/chats/chat.service';
import { chatService } from 'services/chats/chat.service';

import { ChatBox, ChatSidebar } from './components/chat';

const Home: NextPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const streamingContentRef = useRef('');

  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  useEffect(() => {
    const loadChats = async () => {
      try {
        const loadedChats = await chatService.list();
        setChats(loadedChats);
        if (loadedChats.length > 0) {
          setActiveChatId(loadedChats[0]._id);
        }
      } catch (error) {
        console.error('Failed to load chats:', error);
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeChatId) return;

      if (messages[activeChatId]) return;

      try {
        const loadedMessages = await chatService.getMessages(activeChatId);
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: loadedMessages,
        }));
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
  }, [activeChatId, messages]);

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    setInput('');
    setStreamingContent('');
  }, []);

  const handleNewChat = useCallback(async () => {
    try {
      const newChat = await chatService.create('New Chat');
      setChats((prev) => [newChat, ...prev]);
      setMessages((prev) => ({ ...prev, [newChat._id]: [] }));
      setActiveChatId(newChat._id);
      setInput('');
      setStreamingContent('');
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  }, []);

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      try {
        await chatService.delete(chatId);
        setChats((prev) => prev.filter((c) => c._id !== chatId));
        setMessages((prev) => {
          const newMessages = { ...prev };
          delete newMessages[chatId];
          return newMessages;
        });
        setActiveChatId((prev) => {
          if (prev === chatId) {
            const remaining = chats.filter((c) => c._id !== chatId);
            return remaining[0]?._id || null;
          }
          return prev;
        });
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    },
    [chats],
  );

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    let chatId = activeChatId;

    if (!chatId) {
      try {
        const newChat = await chatService.create('New Chat');
        setChats((prev) => [newChat, ...prev]);
        setMessages((prev) => ({ ...prev, [newChat._id]: [] }));
        setActiveChatId(newChat._id);
        chatId = newChat._id;
      } catch (error) {
        console.error('Failed to create chat:', error);
        return;
      }
    }

    const userMessage: Message = {
      _id: `temp-${Date.now()}`,
      chatId,
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), userMessage],
    }));

    const messageContent = input.trim();
    setInput('');
    setIsLoading(true);
    streamingContentRef.current = '';
    setStreamingContent('');

    try {
      await chatService.sendMessage(chatId, messageContent, {
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

          chatService.list().then(setChats);
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
  }, [input, activeChatId, isLoading]);

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

export default Home;
