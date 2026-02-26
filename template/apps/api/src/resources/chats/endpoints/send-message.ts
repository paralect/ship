import { z } from 'zod';

import { chatService, messageService } from 'resources/chats';

import { aiService } from 'services';
import createEndpoint from 'routes/createEndpoint';

const schema = z.object({
  content: z.string().min(1),
});

export default createEndpoint({
  method: 'post',
  path: '/:chatId/messages',
  schema,

  async handler(ctx) {
    const { chatId } = ctx.params;
    const { content } = ctx.validatedData;
    const userId = ctx.state.user._id;

    const chat = await chatService.findOne({ _id: chatId, userId });

    if (!chat) {
      ctx.throw(404, 'Chat not found');
      return;
    }

    await messageService.insertOne({
      chatId,
      role: 'user',
      content,
    });

    const { results: allMessages } = await messageService.find({ chatId }, {}, { sort: { createdOn: 1 } });

    const aiMessages = allMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const result = aiService.generateStreamingResponse(aiMessages);

    ctx.set('Content-Type', 'text/event-stream');
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Connection', 'keep-alive');

    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        const textEncoder = new TextEncoder();

        try {
          for await (const chunk of result.textStream) {
            fullResponse += chunk;
            const data = JSON.stringify({ type: 'text', content: chunk });
            controller.enqueue(textEncoder.encode(`data: ${data}\n\n`));
          }

          if (!fullResponse.trim()) {
            const errorData = JSON.stringify({ type: 'error', message: 'AI returned empty response' });
            controller.enqueue(textEncoder.encode(`data: ${errorData}\n\n`));
            controller.close();
            return;
          }

          const assistantMessage = await messageService.insertOne({
            chatId,
            role: 'assistant',
            content: fullResponse,
          });

          const doneData = JSON.stringify({
            type: 'done',
            messageId: assistantMessage._id,
          });
          controller.enqueue(textEncoder.encode(`data: ${doneData}\n\n`));

          if (!chat.title || chat.title === 'New Chat') {
            const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
            await chatService.updateOne({ _id: chatId }, () => ({ title }));
          }

          controller.close();
        } catch (error) {
          console.error('AI streaming error:', error);
          const errorMsg = error instanceof Error ? error.message : 'AI generation failed';
          const errorData = JSON.stringify({ type: 'error', message: errorMsg });
          controller.enqueue(textEncoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    ctx.body = stream;
  },
});
