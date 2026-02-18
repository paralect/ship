import Link from 'next/link';
import { MessageSquare, PanelLeftClose, PanelLeftOpen, Plus, Trash2 } from 'lucide-react';

import { LogoImage } from 'public/images';

import { RoutePath } from 'routes';

import UserMenu from './UserMenu';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, formatRelativeDate } from '@/lib/utils';

export interface Chat {
  id: string;
  title?: string;
  updatedOn?: Date;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  isCollapsed: boolean;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onToggleCollapse: () => void;
}

const ChatSidebar = ({
  chats,
  activeChatId,
  isCollapsed,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onToggleCollapse,
}: ChatSidebarProps) => {
  return (
    <div
      className={cn(
        'flex h-full flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3">
        {!isCollapsed && (
          <Link href={RoutePath.Home}>
            <LogoImage className="h-6" />
          </Link>
        )}

        <Button variant="ghost" size="icon-sm" onClick={onToggleCollapse} className={cn(isCollapsed && 'mx-auto')}>
          {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </div>

      <div className="p-2">
        <Button
          onClick={onNewChat}
          className={cn('w-full gap-2', isCollapsed && 'px-0')}
          size={isCollapsed ? 'icon' : 'default'}
        >
          <Plus className="size-4" />
          {!isCollapsed && 'New Chat'}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {chats.length === 0
            ? !isCollapsed && (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                  <MessageSquare className="size-8" />
                  <p className="text-sm">No chats yet</p>
                </div>
              )
            : chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    'group flex cursor-pointer items-center gap-2 overflow-hidden rounded-lg px-3 py-2 transition-colors hover:bg-muted',
                    activeChatId === chat.id && 'bg-muted',
                    isCollapsed && 'justify-center px-0',
                  )}
                  onClick={() => onSelectChat(chat.id)}
                  title={isCollapsed ? chat.title : undefined}
                >
                  <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                  {!isCollapsed && (
                    <>
                      <div className="max-w-[150px] flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium" title={chat.title || 'New Chat'}>
                          {chat.title || 'New Chat'}
                        </p>
                        {chat.updatedOn && (
                          <p className="truncate text-xs text-muted-foreground">{formatRelativeDate(chat.updatedOn)}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
        </div>
      </ScrollArea>

      <UserMenu isCollapsed={isCollapsed} />
    </div>
  );
};

export default ChatSidebar;
