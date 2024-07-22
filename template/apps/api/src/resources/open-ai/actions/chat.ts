import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import crypto from 'crypto';
import z from 'zod';

import { openAIService } from 'resources/open-ai';

import { validateMiddleware } from 'middlewares';

import { AiChat, AIMessage, AppKoaContext, AppRouter, ChatRoleType, Next } from 'types';

const createMessageFromText = ({ text, role }: { text: string; role: ChatRoleType }): AIMessage => ({
  id: crypto.randomUUID().toString(),
  content: text,
  role,
  createdOn: new Date(),
});

const schema = z.object({
  prompt: z.string(),
  chatId: z.string().optional(),
});

interface ValidatedData extends z.infer<typeof schema> {
  message: AIMessage;
  aiChat: AiChat;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { prompt, chatId } = ctx.validatedData;
  const { user } = ctx.state;

  const transformedPromptToMessage = createMessageFromText({
    text: prompt,
    role: ChatRoleType.USER,
  });

  let aiChat: AiChat | null = null;

  if (chatId) {
    aiChat = await openAIService.findOne({ _id: chatId, userId: user._id });
    ctx.assertClientError(aiChat, { global: 'Error finding chat' });
  } else {
    const { text: title } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: `Generate a short title for a chatbot conversation based on the first user prompt. [prompt]: ${prompt}`,
    });

    aiChat = await openAIService.insertOne({
      _id: crypto.randomUUID(),
      messages: [],
      lastMessageOn: new Date(),
      userId: user._id,
      title,
    });
  }

  ctx.assertClientError(aiChat, { global: 'Error creating chat' });

  ctx.validatedData.message = transformedPromptToMessage;
  ctx.validatedData.aiChat = aiChat;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { message, aiChat } = ctx.validatedData;
  let fullMessage = '';
  try {
    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: aiChat.messages.concat(message),
    });

    const reader = result.textStream.getReader();

    ctx.res.writeHead(200, {
      'Access-Control-Expose-Headers': 'X-Chat-Id',
      'X-Chat-Id': aiChat._id,
      'Content-Type': 'text/plain; charset=utf-8',
      connection: 'keep-alive',
    });

    let done = false;

    while (!done) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        fullMessage += value;
        ctx.res.write(value);
      }
    }

    ctx.res.end();
  } catch (error) {
    console.error(error);
  }

  openAIService.updateOne(
    {
      _id: aiChat._id,
    },
    (old) => ({
      messages: old.messages.concat([
        message,
        createMessageFromText({ text: fullMessage, role: ChatRoleType.ASSISTANT }),
      ]),
      lastMessageOn: new Date(),
    }),
  );
}

export default (router: AppRouter) => {
  router.post('/chat', validateMiddleware(schema), validator, handler);
};
