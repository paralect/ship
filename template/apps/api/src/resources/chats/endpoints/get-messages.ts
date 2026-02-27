import { messageService } from 'resources/chats';

import createEndpoint from 'routes/createEndpoint';
import shouldExist from 'routes/middlewares/shouldExist';

export default createEndpoint({
  method: 'get',
  path: '/:chatId/messages',
  middlewares: [
    shouldExist('chats', {
      criteria: (ctx) => ({ _id: ctx.params.chatId, userId: ctx.state.user._id }),
    }),
  ],

  async handler(ctx) {
    const { chatId } = ctx.params;

    const { results: messages } = await messageService.find({ chatId }, {}, { sort: { createdOn: 1 } });

    return messages;
  },
});
