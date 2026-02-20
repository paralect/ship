import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery } from 'hooks';
import { ChevronDown, Home, MessageSquare, Plus, Trash2, Users } from 'lucide-react';

import { apiClient } from 'services/api-client.service';

import { RoutePath } from 'routes';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn, formatRelativeDate } from '@/lib/utils';

interface NavigationProps {
  isCollapsed: boolean;
}

const Navigation = ({ isCollapsed }: NavigationProps) => {
  const router = useRouter();
  const qc = useQueryClient();
  const [isChatExpanded, setIsChatExpanded] = useState(true);

  const { data: chats = [] } = useApiQuery(apiClient.chats.list);

  const currentPath = router.pathname;
  const currentChatId = router.query.chatId as string | undefined;

  const handleNewChat = () => {
    router.push('/chat');
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiClient.chats.delete.call({}, { pathParams: { chatId } });
      qc.invalidateQueries({ queryKey: [apiClient.chats.list.path] });
      if (currentChatId === chatId) {
        router.push('/chat');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="flex flex-col gap-1 p-2">
      <Link href={RoutePath.Home}>
        <div
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-muted',
            currentPath === RoutePath.Home && 'bg-muted',
            isCollapsed && 'justify-center px-0',
          )}
          title={isCollapsed ? 'Dashboard' : undefined}
        >
          <Home className="size-4 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Dashboard</span>}
        </div>
      </Link>

      <Link href={RoutePath.Admin}>
        <div
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-muted',
            currentPath === RoutePath.Admin && 'bg-muted',
            isCollapsed && 'justify-center px-0',
          )}
          title={isCollapsed ? 'Admin' : undefined}
        >
          <Users className="size-4 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Admin</span>}
        </div>
      </Link>

      <Collapsible open={!isCollapsed && isChatExpanded} onOpenChange={setIsChatExpanded}>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-muted',
              (currentPath === RoutePath.ChatIndex || currentPath === RoutePath.Chat) && 'bg-muted',
              isCollapsed && 'justify-center px-0',
            )}
            onClick={() => {
              if (isCollapsed) {
                router.push(RoutePath.ChatIndex);
              }
            }}
            title={isCollapsed ? 'Chat' : undefined}
          >
            <MessageSquare className="size-4 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm font-medium">Chat</span>
                <ChevronDown
                  className={cn('size-4 transition-transform duration-200', !isChatExpanded && '-rotate-90')}
                />
              </>
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
          <div className="ml-4 mt-1 flex flex-col gap-1 border-l pl-2">
            <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={handleNewChat}>
              <Plus className="size-3" />
              New Chat
            </Button>

            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-4 text-muted-foreground">
                <p className="text-xs">No chats yet</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  className={cn(
                    'group flex cursor-pointer items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted',
                    currentChatId === chat._id && 'bg-muted',
                  )}
                  onClick={() => handleSelectChat(chat._id)}
                >
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm" title={chat.title || 'New Chat'}>
                      {chat.title || 'New Chat'}
                    </p>
                    {chat.updatedOn && (
                      <p className="truncate text-xs text-muted-foreground">
                        {formatRelativeDate(new Date(chat.updatedOn))}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => handleDeleteChat(chat._id, e)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Navigation;
