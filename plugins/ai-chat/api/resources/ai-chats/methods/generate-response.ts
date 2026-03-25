import process from 'node:process';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const MAX_CONTEXT_MESSAGES = 50;

interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

const generateResponse = async (messages: AiMessage[]): Promise<string> => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const contextMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

  const result = await generateText({
    model: google('gemini-2.5-flash'),
    messages: contextMessages,
  });

  return result.text;
};

export default generateResponse;
