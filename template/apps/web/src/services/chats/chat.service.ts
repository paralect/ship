import config from 'config';

const API_URL = config.API_URL;

export interface Chat {
  _id: string;
  userId: string;
  title?: string;
  createdOn?: Date;
  updatedOn?: Date;
}

export interface Message {
  _id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdOn?: Date;
}

interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: (messageId: string) => void;
  onError: (error: string) => void;
}

const fetchWithCredentials = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

export const chatService = {
  async list(): Promise<Chat[]> {
    const response = await fetchWithCredentials(`${API_URL}/chats`);
    return response.json();
  },

  async create(title?: string): Promise<Chat> {
    const response = await fetchWithCredentials(`${API_URL}/chats`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return response.json();
  },

  async delete(chatId: string): Promise<void> {
    await fetchWithCredentials(`${API_URL}/chats/${chatId}`, {
      method: 'DELETE',
    });
  },

  async getMessages(chatId: string): Promise<Message[]> {
    const response = await fetchWithCredentials(`${API_URL}/chats/${chatId}/messages`);
    return response.json();
  },

  async sendMessage(chatId: string, message: string, callbacks: StreamCallbacks): Promise<void> {
    const response = await fetchWithCredentials(`${API_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError('No response body');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE events
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'text') {
              callbacks.onToken(data.content);
            } else if (data.type === 'done') {
              callbacks.onDone(data.messageId);
            } else if (data.type === 'error') {
              callbacks.onError(data.message);
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  },
};

export default chatService;
