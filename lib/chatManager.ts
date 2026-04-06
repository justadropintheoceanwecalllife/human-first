import { supabase } from './supabase';
import Anthropic from '@anthropic-ai/sdk';

export interface ChatMessage {
  id: string;
  challengeId: string;
  userId: string | null;
  message: string;
  displayName?: string;
  isAi: boolean;
  createdAt: string;
}

/**
 * Get chat messages for today's challenge
 */
export async function getChatMessages(challengeId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('challenge_id', challengeId)
    .order('created_at', { ascending: true })
    .limit(100);

  if (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }

  return data.map(msg => ({
    id: msg.id,
    challengeId: msg.challenge_id,
    userId: msg.user_id,
    message: msg.message,
    isAi: msg.is_ai,
    createdAt: msg.created_at,
  }));
}

/**
 * Send a chat message
 */
export async function sendChatMessage(
  challengeId: string,
  userId: string | null,
  message: string,
  displayName?: string
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      challenge_id: challengeId,
      user_id: userId,
      message,
      is_ai: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to send message:', error);
    throw error;
  }

  return {
    id: data.id,
    challengeId: data.challenge_id,
    userId: data.user_id,
    message: data.message,
    displayName,
    isAi: data.is_ai,
    createdAt: data.created_at,
  };
}

/**
 * Send AI message
 */
export async function sendAiMessage(
  challengeId: string,
  message: string
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      challenge_id: challengeId,
      user_id: null,
      message,
      is_ai: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to send AI message:', error);
    throw error;
  }

  return {
    id: data.id,
    challengeId: data.challenge_id,
    userId: null,
    message: data.message,
    isAi: true,
    createdAt: data.created_at,
  };
}

/**
 * Subscribe to real-time chat updates
 */
export function subscribeToChatMessages(
  challengeId: string,
  callback: (message: ChatMessage) => void
) {
  const channel = supabase
    .channel(`chat:${challengeId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `challenge_id=eq.${challengeId}`,
      },
      (payload) => {
        const newMessage = payload.new as any;
        callback({
          id: newMessage.id,
          challengeId: newMessage.challenge_id,
          userId: newMessage.user_id,
          message: newMessage.message,
          isAi: newMessage.is_ai,
          createdAt: newMessage.created_at,
        });
      }
    )
    .subscribe();

  return channel;
}

/**
 * Generate AI facilitator response
 */
export async function generateAiResponse(
  recentMessages: ChatMessage[],
  challengeTitle: string,
  submissionCount: number
): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
  });

  const conversationContext = recentMessages
    .slice(-10)
    .map(msg => `${msg.isAi ? 'AI' : 'User'}: ${msg.message}`)
    .join('\n');

  const systemPrompt = `You are a friendly AI facilitator for "human-first", a wellness chatroom where GovTech employees share hands-on tasks they completed.

Today's challenge: ${challengeTitle}
Total submissions: ${submissionCount}

Your role:
- Keep the conversation flowing with warm, encouraging questions
- Connect people who share similar experiences
- Celebrate small wins and creativity
- Ask follow-up questions about their submissions
- Keep it light, friendly, and human
- Use casual, conversational language
- Keep responses SHORT (1-2 sentences max)

Style: Like a friendly colleague taking a break with you, not a corporate bot.

Recent conversation:
${conversationContext}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: 'Based on the recent conversation, what should I say next to keep the vibe going?',
        },
      ],
      system: systemPrompt,
    });

    const textContent = response.content.find(c => c.type === 'text');
    return textContent ? (textContent as any).text : 'Hey everyone! 👋';
  } catch (error) {
    console.error('Failed to generate AI response:', error);
    return 'What did everyone make today? 👀';
  }
}
