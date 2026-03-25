import { useRouter } from 'next/router';

import { LayoutType, Page, ScopeType } from 'components';

import { AiChatPage } from './index.page';

const AiChatWithIdPage = () => {
  const router = useRouter();
  const { chatId } = router.query;

  return (
    <Page scope={ScopeType.PRIVATE} layout={LayoutType.MAIN}>
      {router.isReady && chatId && typeof chatId === 'string' ? <AiChatPage key={chatId} chatId={chatId} /> : null}
    </Page>
  );
};

export default AiChatWithIdPage;
