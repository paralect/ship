import { useEffect, useRef } from 'react';

import { ScrollArea } from 'components/ui/scroll-area';

import AiChatInput from './AiChatInput';
import type { AiChatDisplayMessage } from './AiChatMessage';
import AiChatMessage from './AiChatMessage';
import AiMessageSkeleton from './AiMessageSkeleton';

interface AiChatBoxProps {
  messages: AiChatDisplayMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isLoadingMessages?: boolean;
}

const AiChatBox = ({ messages, input, onInputChange, onSubmit, isLoading, isLoadingMessages }: AiChatBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const prevMessagesLength = useRef(0);
  const isEmpty = messages.length === 0 && !isLoadingMessages;

  useEffect(() => {
    if (messages.length === 0) return;

    const isNewMessagesAdded = messages.length > prevMessagesLength.current;
    const behavior = isInitialLoad.current ? 'instant' : 'smooth';

    messagesEndRef.current?.scrollIntoView({ behavior: isNewMessagesAdded || isLoading ? behavior : 'instant' });

    if (isInitialLoad.current && messages.length > 0) {
      isInitialLoad.current = false;
    }
    prevMessagesLength.current = messages.length;
  }, [messages, isLoading]);

  if (isEmpty) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background">
        <AiChatInput value={input} onChange={onInputChange} onSubmit={onSubmit} isLoading={isLoading} isCentered />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-3xl px-4 py-4">
            {isLoadingMessages ? (
              <AiMessageSkeleton />
            ) : (
              <>
                {messages.map((message) => (
                  <AiChatMessage key={message.id} message={message} />
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

      <AiChatInput value={input} onChange={onInputChange} onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AiChatBox;
