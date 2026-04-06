import { NextRequest, NextResponse } from 'next/server';
import { getChatMessages, sendAiMessage, generateAiResponse } from '@/lib/chatManager';
import { getChallengeById } from '@/lib/challenges';
import { getAllSubmissions } from '@/lib/supabaseUserManager';

export async function POST(request: NextRequest) {
  try {
    const { challengeId } = await request.json();

    if (!challengeId) {
      return NextResponse.json(
        { error: 'Challenge ID is required' },
        { status: 400 }
      );
    }

    // Get recent messages
    const messages = await getChatMessages(challengeId);

    // Get challenge info
    const challenge = getChallengeById(challengeId);
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Get submission count
    const submissions = await getAllSubmissions();
    const todaySubmissions = submissions.filter(
      sub => sub.challengeId === challengeId
    );

    // Don't respond if AI just spoke
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.isAi) {
      return NextResponse.json({ message: 'AI recently spoke, skipping' });
    }

    // Generate AI response
    const aiResponse = await generateAiResponse(
      messages,
      challenge.title,
      todaySubmissions.length
    );

    // Send AI message
    await sendAiMessage(challengeId, aiResponse);

    return NextResponse.json({ message: 'AI response sent', response: aiResponse });
  } catch (error) {
    console.error('AI facilitate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
