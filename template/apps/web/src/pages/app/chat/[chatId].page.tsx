import { useRouter } from 'next/router';

import { LayoutType, Page, ScopeType } from 'components';

import { ChatPage } from './index.page';

const ChatWithIdPage = () => {
  const router = useRouter();
  const { chatId } = router.query;

  return (
    <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
      {router.isReady && chatId && typeof chatId === 'string' ? <ChatPage key={chatId} chatId={chatId} /> : null}
    </Page>
  );
};

export default ChatWithIdPage;
