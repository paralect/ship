import { z } from 'zod';

import { chatService, messageService } from 'resources/chats';

import createEndpoint from 'routes/createEndpoint';

const schema = z.object({});

export default createEndpoint({
  method: 'get',
  path: '/:chatId/messages',
  schema,

  async handler(ctx) {
    const { chatId } = ctx.params;
    const userId = ctx.state.user._id;

    const chat = await chatService.findOne({ _id: chatId, userId });

    if (!chat) {
      ctx.throw(404, 'Chat not found');
      return;
    }

    const { results: messages } = await messageService.find({ chatId }, {}, { sort: { createdOn: 1 } });

    ctx.body = messages;
  },
});
