import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

import config from 'config';

const MAX_CONTEXT_MESSAGES = 50;

const google = createGoogleGenerativeAI({
  apiKey: config.GOOGLE_GENERATIVE_AI_API_KEY,
});

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

const generateStreamingResponse = (messages: AiMessage[]) => {
  const contextMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

  return streamText({
    model: google('gemini-2.5-flash'),
    messages: contextMessages,
  });
};

export default {
  generateStreamingResponse,
  MAX_CONTEXT_MESSAGES,
};
