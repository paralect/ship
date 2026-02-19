import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';

import ChatInput from './ChatInput';
import type { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';

import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatBoxProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const ChatBox = ({ messages, input, onInputChange, onSubmit, isLoading }: ChatBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col rounded-lg border bg-background">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-3xl px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-muted-foreground">
                <MessageSquare className="size-12" />

                <div className="text-center">
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start a conversation by typing a message below</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 py-4 text-muted-foreground">
                    <div className="flex gap-1">
                      <span className="size-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                      <span className="size-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                      <span className="size-2 animate-bounce rounded-full bg-current" />
                    </div>
                    <span className="text-sm">Assistant is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      <ChatInput value={input} onChange={onInputChange} onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default ChatBox;
