import { createFileRoute } from '@tanstack/react-router';

import { AiChatPage } from './index';

export const Route = createFileRoute('/_authenticated/app/ai-chat/$chatId')({
  component: AiChatWithIdPage,
});

function AiChatWithIdPage() {
  const { chatId } = Route.useParams();
  return <AiChatPage key={chatId} chatId={chatId} />;
}
