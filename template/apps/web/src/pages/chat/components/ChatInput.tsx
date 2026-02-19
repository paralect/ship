import { Send } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

const ChatInput = ({ value, onChange, onSubmit, isLoading, placeholder = 'Type a message...' }: ChatInputProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="border-t bg-background px-4 py-4">
      <div className="mx-auto flex max-w-3xl gap-2">
        <Textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="max-h-32 min-h-10 resize-none"
          rows={1}
        />

        <Button onClick={onSubmit} disabled={!value.trim() || isLoading} size="icon" className="shrink-0">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
