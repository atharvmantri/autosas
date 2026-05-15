import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  const body = await request.json();
  const { youtubeUrl } = body;

  if (!youtubeUrl) {
    return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at converting video content into viral Twitter threads. Extract key points, create hooks, and format as a numbered thread. Each tweet must be under 280 characters. Return ONLY a JSON array of strings.',
        },
        {
          role: 'user',
          content: `Convert this YouTube video into a Twitter thread: ${youtubeUrl}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{"thread": []}';
    const parsed = JSON.parse(content);
    const thread = parsed.thread || [];

    return NextResponse.json({ thread });
  } catch (error) {
    console.error('Thread generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate thread. Please try again.', thread: ['Hook: This video changes everything.', 'Key point 1: ...', 'Key point 2: ...', 'TL;DR: Watch the full video!'] },
      { status: 200 }
    );
  }
}
