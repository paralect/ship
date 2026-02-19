import config from 'config';

const API_URL = config.API_URL;

interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: (messageId: string) => void;
  onError: (error: string) => void;
}

export const chatService = {
  async sendMessage(chatId: string, content: string, callbacks: StreamCallbacks): Promise<void> {
    const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      callbacks.onError(`HTTP error! status: ${response.status}`);
      return;
    }

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
          } catch {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  },
};

export default chatService;
