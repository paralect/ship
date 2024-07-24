import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';
import z from 'zod';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, AppRouter, ChatRoleType } from 'types';

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.nativeEnum(ChatRoleType),
      content: z.string(),
    }),
  ),
});

interface ValidatedData {
  messages: CoreMessage[];
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { messages } = ctx.validatedData;

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  ctx.res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    connection: 'keep-alive',
  });

  const reader = result.textStream.getReader();

  let done = false;

  while (!done) {
    // eslint-disable-next-line no-await-in-loop
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      ctx.res.write(value);
    }
  }

  ctx.res.end();
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
