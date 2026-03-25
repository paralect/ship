import { KeyboardEvent, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

import { Button } from 'components/ui/button';
import { Textarea } from 'components/ui/textarea';
import { cn } from 'lib/utils';

interface AiChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  isCentered?: boolean;
}

const AiChatInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = 'Ask anything...',
  isCentered = false,
}: AiChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      textareaRef.current?.focus();
    }, 350);

    return () => clearTimeout(timeout);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className={cn('flex w-full items-center justify-center px-4', !isCentered && 'py-4')}>
      <div className={cn('w-full max-w-2xl', isCentered && 'flex flex-col items-center gap-4')}>
        {isCentered && (
          <div className="px-4 text-center">
            <h1 className="text-xl font-semibold sm:text-2xl">What can I help with?</h1>
          </div>
        )}

        <div className="relative w-full">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={isCentered ? 4 : 1}
            className={cn(
              'w-full resize-none pr-12 text-sm',
              isCentered && 'min-h-[120px]',
            )}
          />
          <div className="absolute bottom-2 right-2">
            <Button
              onClick={handleSubmit}
              disabled={!value.trim() || isLoading}
              size="icon"
              className="size-8 shrink-0 rounded-full"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>

        {isCentered && <p className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>}
      </div>
    </div>
  );
};

export default AiChatInput;
