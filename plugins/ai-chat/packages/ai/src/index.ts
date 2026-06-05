import process from 'node:process';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, type LanguageModelV1 } from 'ai';

const MAX_CONTEXT_MESSAGES = 50;

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiConfig {
  model?: LanguageModelV1;
  maxContextMessages?: number;
}

let globalConfig: AiConfig = {};

export function configureAi(config: AiConfig): void {
  globalConfig = config;
}

function getModel(): LanguageModelV1 {
  if (globalConfig.model) return globalConfig.model;

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set. Set it or call configureAi({ model }) to use a custom model.');
  }

  const google = createGoogleGenerativeAI({ apiKey });
  return google('gemini-2.5-flash');
}

export async function generateResponse(messages: AiMessage[]): Promise<string> {
  const maxMessages = globalConfig.maxContextMessages ?? MAX_CONTEXT_MESSAGES;
  const contextMessages = messages.slice(-maxMessages);

  const result = await generateText({
    model: getModel(),
    messages: contextMessages,
  });

  return result.text;
}
