# AI Chat Plugin

AI chat with Google Gemini. Users can create conversations, send messages, and get AI responses.

## Setup

### 1. Environment variables

Add to your API `.env` file:

```
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key
```

Get a key at [Google AI Studio](https://aistudio.google.com/apikey).

### 2. Run with dev server

```bash
pnpm plugin:dev plugins/auth-starter plugins/ai-chat
```

The plugin requires `auth-starter` for authentication.

## What's included

### API

| Endpoint | Description |
|----------|-------------|
| `aiChats.create` | Create a new chat |
| `aiChats.list` | List user's chats (newest first) |
| `aiChats.remove` | Delete a chat and its messages |
| `aiChats.getMessages` | Get all messages in a chat |
| `aiChats.sendMessage` | Send a message and get an AI response |

### DB tables

- `ai_chats` — id, title, userId, timestamps
- `ai_messages` — id, chatId, role (user/assistant), content, timestamps

### Web pages

- `/ai-chat` — New conversation
- `/ai-chat/[chatId]` — Existing conversation

## AI model

Uses Google Gemini (`gemini-2.5-flash`) via the [Vercel AI SDK](https://sdk.vercel.ai). To change the model, edit `api/resources/aiChats/methods/generate-response.ts`.
