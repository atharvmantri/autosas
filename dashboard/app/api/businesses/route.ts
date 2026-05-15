import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ businesses: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt } = body;

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  // In production, this triggers the CEO agent orchestrator
  return NextResponse.json({ message: 'Business launch initiated', prompt });
}
