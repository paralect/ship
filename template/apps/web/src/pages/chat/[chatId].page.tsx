import { useRouter } from 'next/router';
import ChatPage from 'pages/chat/index.page';

const ChatWithIdPage = () => {
  const router = useRouter();
  const { chatId } = router.query;

  if (!router.isReady || !chatId || typeof chatId !== 'string') {
    return null;
  }

  return <ChatPage key={chatId} chatId={chatId} />;
};

export default ChatWithIdPage;
