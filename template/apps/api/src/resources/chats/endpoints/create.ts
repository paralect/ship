import { z } from 'zod';

import { chatService } from 'resources/chats';

import createEndpoint from 'routes/createEndpoint';

const schema = z.object({
  title: z.string().min(1).max(255).optional(),
});

export default createEndpoint({
  method: 'post',
  path: '/',
  schema,

  async handler(ctx) {
    const { title } = ctx.validatedData;
    const userId = ctx.state.user._id;

    const chat = await chatService.insertOne({
      userId,
      title: title || 'New Chat',
    });

    ctx.body = chat;
  },
});
