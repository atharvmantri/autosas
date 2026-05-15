import axios from 'axios';

const LOCUS_API_BASE = process.env.LOCUS_API_BASE || 'https://api.paywithlocus.com/api';

function getHeaders(apiKey: string): Record<string, string> {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

export async function getBalance(apiKey: string): Promise<number> {
  const response = await axios.get(`${LOCUS_API_BASE}/wallet/balance`, {
    headers: getHeaders(apiKey),
  });
  return response.data.balance;
}

export async function setAllowance(apiKey: string, amount: number): Promise<void> {
  await axios.post(
    `${LOCUS_API_BASE}/wallet/allowance`,
    { amount },
    { headers: getHeaders(apiKey) }
  );
}

export async function setApprovalThreshold(apiKey: string, amount: number): Promise<void> {
  await axios.post(
    `${LOCUS_API_BASE}/wallet/threshold`,
    { amount },
    { headers: getHeaders(apiKey) }
  );
}

export interface WalletTransaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  timestamp: string;
  description: string;
}

export async function listTransactions(apiKey: string): Promise<WalletTransaction[]> {
  const response = await axios.get(`${LOCUS_API_BASE}/wallet/transactions`, {
    headers: getHeaders(apiKey),
  });
  return response.data.transactions;
}
