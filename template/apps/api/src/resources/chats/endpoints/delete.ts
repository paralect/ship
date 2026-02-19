import { z } from 'zod';

import { chatService, messageService } from 'resources/chats';

import createEndpoint from 'routes/createEndpoint';

const schema = z.object({});

export default createEndpoint({
  method: 'delete',
  path: '/:chatId',
  schema,

  async handler(ctx) {
    const { chatId } = ctx.params;
    const userId = ctx.state.user._id;

    const chat = await chatService.findOne({ _id: chatId, userId });

    if (!chat) {
      ctx.throw(404, 'Chat not found');
      return;
    }

    await messageService.deleteMany({ chatId });

    await chatService.deleteOne({ _id: chatId });

    return { success: true };
  },
});
