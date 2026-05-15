import axios from 'axios';

const LOCUS_API_BASE = process.env.LOCUS_API_BASE || 'https://api.paywithlocus.com/api';

function getHeaders(apiKey: string): Record<string, string> {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

export async function createSession(
  apiKey: string,
  amount: string,
  description: string,
  webhookUrl: string
): Promise<{ sessionId: string; checkoutUrl: string }> {
  const response = await axios.post(
    `${LOCUS_API_BASE}/checkout/sessions`,
    { amount, currency: 'USDC', description, webhook_url: webhookUrl },
    { headers: getHeaders(apiKey) }
  );
  return {
    sessionId: response.data.session_id,
    checkoutUrl: response.data.checkout_url,
  };
}

export async function getSessionStatus(apiKey: string, sessionId: string): Promise<string> {
  const response = await axios.get(
    `${LOCUS_API_BASE}/checkout/sessions/${sessionId}`,
    { headers: getHeaders(apiKey) }
  );
  return response.data.status;
}

export async function listSessions(apiKey: string): Promise<any[]> {
  const response = await axios.get(
    `${LOCUS_API_BASE}/checkout/sessions`,
    { headers: getHeaders(apiKey) }
  );
  return response.data.sessions;
}
