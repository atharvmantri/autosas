import { NextResponse } from 'next/server';
import { createSession } from '@agent/tools/checkout';

export async function POST(request: Request) {
  const body = await request.json();
  const { tierName, amount, description } = body;

  if (!amount || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const result = await createSession(
      process.env.LOCUS_API_KEY || '',
      amount,
      description,
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhook/locus`
    );

    return NextResponse.json({
      sessionId: result.sessionId,
      checkoutUrl: result.checkoutUrl,
      tierName,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
