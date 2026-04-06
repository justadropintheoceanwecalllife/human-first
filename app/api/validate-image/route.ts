import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, challengeTitle, challengeDescription, challengePrompt } = await request.json();

    if (!imageBase64 || !challengeTitle) {
      return NextResponse.json(
        { error: 'Image and challenge info required' },
        { status: 400 }
      );
    }

    const anthropicKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      // Fallback for demo mode
      return NextResponse.json({
        isValid: true,
        confidence: 'high',
        reasoning: "Demo mode - validation skipped. In production, Claude Vision will verify your submission!",
        suggestion: null,
      });
    }

    const anthropic = new Anthropic({
      apiKey: anthropicKey,
    });

    // Extract base64 data and media type
    const base64Match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (!base64Match) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    const mediaType = base64Match[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    const base64Data = base64Match[2];

    // Call Claude Vision API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `You are validating submissions for "human-first", a wellness platform where people complete hands-on challenges.

Today's challenge: "${challengeTitle}"
Description: "${challengeDescription}"
Prompt: "${challengePrompt}"

Please analyze this image and determine:
1. Does it genuinely match the challenge? (yes/no)
2. Confidence level (high/medium/low)
3. Brief reasoning (1-2 sentences, friendly tone)
4. If it doesn't match, suggest what would be better

Be encouraging and friendly! If it's a creative interpretation, give them credit. Only reject if it's clearly unrelated or inappropriate.

Respond in this exact JSON format:
{
  "isValid": true/false,
  "confidence": "high"/"medium"/"low",
  "reasoning": "Your reasoning here",
  "suggestion": "What would be better (null if valid)"
}`,
            },
          ],
        },
      ],
    });

    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse the JSON response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse Claude response');
    }

    const validation = JSON.parse(jsonMatch[0]);

    return NextResponse.json(validation);
  } catch (error) {
    console.error('Image validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate image' },
      { status: 500 }
    );
  }
}
