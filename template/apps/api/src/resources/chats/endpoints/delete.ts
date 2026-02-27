import { chatService, messageService } from 'resources/chats';

import createEndpoint from 'routes/createEndpoint';
import shouldExist from 'routes/middlewares/shouldExist';

export default createEndpoint({
  method: 'delete',
  path: '/:chatId',
  middlewares: [
    shouldExist('chats', {
      criteria: (ctx) => ({ _id: ctx.params.chatId, userId: ctx.state.user._id }),
    }),
  ],

  async handler(ctx) {
    const { chatId } = ctx.params;

    await messageService.deleteMany({ chatId });
    await chatService.deleteOne({ _id: chatId });

    return { success: true };
  },
});
