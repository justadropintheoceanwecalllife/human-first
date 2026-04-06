import { ChatMessage } from './chatManager';
import { mockChatMessages } from './mockData';

const CHAT_STORAGE_KEY = 'mock-chat-messages';

/**
 * Mock version - Get chat messages
 */
export async function getChatMessagesMock(challengeId: string): Promise<ChatMessage[]> {
  if (typeof window === 'undefined') return mockChatMessages;

  const stored = localStorage.getItem(`${CHAT_STORAGE_KEY}-${challengeId}`);

  if (stored) {
    try {
      const userMessages = JSON.parse(stored) as ChatMessage[];
      // Combine mock messages with user messages
      const all = [...mockChatMessages, ...userMessages];
      return all.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch (e) {
      console.error('Failed to parse chat messages:', e);
    }
  }

  return mockChatMessages;
}

/**
 * Mock version - Send chat message
 */
export async function sendChatMessageMock(
  challengeId: string,
  userId: string | null,
  message: string,
  displayName?: string
): Promise<ChatMessage> {
  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    challengeId,
    userId,
    displayName,
    message,
    isAi: false,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const messages = await getChatMessagesMock(challengeId);
    // Filter out mock messages, only store user messages
    const userMessages = messages.filter(m => !mockChatMessages.find(mm => mm.id === m.id));
    userMessages.push(newMessage);
    localStorage.setItem(`${CHAT_STORAGE_KEY}-${challengeId}`, JSON.stringify(userMessages));

    // Simulate real-time update
    window.dispatchEvent(new CustomEvent('mock-chat-message', { detail: newMessage }));
  }

  return newMessage;
}

/**
 * Mock version - Send AI message
 */
export async function sendAiMessageMock(
  challengeId: string,
  message: string
): Promise<ChatMessage> {
  const newMessage: ChatMessage = {
    id: `msg-ai-${Date.now()}`,
    challengeId,
    userId: null,
    message,
    isAi: true,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const messages = await getChatMessagesMock(challengeId);
    const userMessages = messages.filter(m => !mockChatMessages.find(mm => mm.id === m.id));
    userMessages.push(newMessage);
    localStorage.setItem(`${CHAT_STORAGE_KEY}-${challengeId}`, JSON.stringify(userMessages));

    // Simulate real-time update
    window.dispatchEvent(new CustomEvent('mock-chat-message', { detail: newMessage }));
  }

  return newMessage;
}

/**
 * Mock version - Subscribe to chat messages (uses custom events)
 */
export function subscribeToChatMessagesMock(
  challengeId: string,
  callback: (message: ChatMessage) => void
) {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ChatMessage>;
    if (customEvent.detail.challengeId === challengeId) {
      callback(customEvent.detail);
    }
  };

  window.addEventListener('mock-chat-message', handler);

  return {
    unsubscribe: () => {
      window.removeEventListener('mock-chat-message', handler);
    },
  };
}

/**
 * Mock version - Generate AI response
 */
export async function generateAiResponseMock(
  recentMessages: ChatMessage[]
): Promise<string> {
  // Simple mock responses
  const responses = [
    "That's awesome! 🌟 What made you choose that approach?",
    "Love it! Anyone else want to share what they made?",
    "Great submission! 👏 What was the most challenging part?",
    "This is so cool! What inspired you?",
    "Nice work! 💪 How long did it take you?",
    "Beautiful! What did you learn from this?",
    "Thanks for sharing! Who else wants to show what they created?",
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return responses[Math.floor(Math.random() * responses.length)];
}
