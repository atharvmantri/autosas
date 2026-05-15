import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const body = await request.json();
  const { tierName, amount, description } = body;

  if (!amount || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const apiKey = process.env.LOCUS_API_KEY || '';
  const apiBase = process.env.LOCUS_API_BASE || 'https://api.paywithlocus.com/api';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = apiBase + '/checkout/sessions';
  const webhookUrl = appUrl + '/api/webhook/locus';

  try {
    const response = await axios.post(
      url,
      { amount, currency: 'USDC', description, webhook_url: webhookUrl },
      { headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' } }
    );

    return NextResponse.json({
      sessionId: response.data.session_id,
      checkoutUrl: response.data.checkout_url,
      tierName,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
