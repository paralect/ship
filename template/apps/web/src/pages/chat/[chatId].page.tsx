import { useRouter } from 'next/router';
import Home from 'pages/home';

const ChatPage = () => {
  const router = useRouter();
  const { chatId } = router.query;

  if (!router.isReady || !chatId || typeof chatId !== 'string') {
    return null;
  }

  return <Home key={chatId} chatId={chatId} />;
};

export default ChatPage;
