import { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from '@/components/ui/prompt-input';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  isCentered?: boolean;
}

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = 'Ask anything...',
  isCentered = false,
}: ChatInputProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const textarea = containerRef.current?.querySelector('textarea');
      textarea?.focus();
    }, 350);

    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div ref={containerRef} className={cn('flex w-full items-center justify-center px-4', !isCentered && 'py-4')}>
      <div className={cn('w-full max-w-2xl', isCentered && 'flex flex-col items-center gap-4')}>
        {isCentered && (
          <div className="text-center px-4">
            <h1 className="text-xl font-semibold sm:text-2xl">What can I help with?</h1>
          </div>
        )}

        <PromptInput
          value={value}
          onValueChange={onChange}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className={cn('w-full', isCentered && 'min-h-[120px]')}
        >
          <PromptInputTextarea autoFocus placeholder={placeholder} className={cn(isCentered && 'min-h-[80px]')} />
          <PromptInputActions className="justify-end px-2 pb-2">
            <PromptInputAction tooltip="Send message">
              <Button
                onClick={handleSubmit}
                disabled={!value.trim() || isLoading}
                size="icon"
                className="size-8 shrink-0 rounded-full"
              >
                <ArrowUp className="size-4" />
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>

        {isCentered && <p className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>}
      </div>
    </div>
  );
};

export default ChatInput;
