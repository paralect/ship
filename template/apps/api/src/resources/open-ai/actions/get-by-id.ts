import z from 'zod';

import { openAIService } from 'resources/open-ai';

import { validateMiddleware } from 'middlewares';

import { AiChat, AppKoaContext, AppRouter, Next } from 'types';

const schema = z.object({
  chatId: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  aiChat: AiChat;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const aiChat = await openAIService.findOne({ _id: ctx.validatedData.chatId, userId: ctx.state.user._id });

  ctx.assertClientError(aiChat, { global: 'Chat not found' });

  ctx.validatedData.aiChat = aiChat;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { aiChat } = ctx.validatedData;
  ctx.body = aiChat;
}

export default (router: AppRouter) => {
  router.get(`/chat/:chatId`, validateMiddleware(schema), validator, handler);
};
