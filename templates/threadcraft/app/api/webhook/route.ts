import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { session_id, status, amount, tx_hash, payer_address } = body;

  console.log('[Webhook] Locus webhook received:', {
    session_id,
    status,
    amount,
    tx_hash,
    payer_address,
  });

  if (status === 'PAID') {
    // Update subscription status in database
    // Grant access to the customer
    // Log transaction to finance agent
    console.log(`[Webhook] Payment confirmed: ${amount} from ${payer_address}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
