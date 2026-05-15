import axios from 'axios';

export interface CheckoutSessionResponse {
  sessionId: string;
  checkoutUrl: string;
}

export interface WalletBalance {
  balance: number;
  currency: string;
}

export interface LocusTransaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  timestamp: string;
  description: string;
}

export class LocusClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || process.env.LOCUS_API_KEY || '';
    this.baseUrl = baseUrl || process.env.LOCUS_API_BASE || 'https://api.paywithlocus.com/api';
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async createCheckoutSession(
    amount: string,
    currency: string,
    description: string,
    webhookUrl: string
  ): Promise<CheckoutSessionResponse> {
    const response = await axios.post(
      `${this.baseUrl}/checkout/sessions`,
      { amount, currency, description, webhook_url: webhookUrl },
      { headers: this.getHeaders() }
    );
    return {
      sessionId: response.data.session_id,
      checkoutUrl: response.data.checkout_url,
    };
  }

  async getSessionStatus(sessionId: string): Promise<string> {
    const response = await axios.get(
      `${this.baseUrl}/checkout/sessions/${sessionId}`,
      { headers: this.getHeaders() }
    );
    return response.data.status;
  }

  async listSessions(): Promise<any[]> {
    const response = await axios.get(
      `${this.baseUrl}/checkout/sessions`,
      { headers: this.getHeaders() }
    );
    return response.data.sessions;
  }

  async getWalletBalance(): Promise<WalletBalance> {
    const response = await axios.get(
      `${this.baseUrl}/wallet/balance`,
      { headers: this.getHeaders() }
    );
    return {
      balance: response.data.balance,
      currency: response.data.currency,
    };
  }

  async setSpendingRules(allowance: number, maxTransactionSize: number, approvalThreshold: number): Promise<void> {
    await axios.post(
      `${this.baseUrl}/wallet/rules`,
      { allowance, maxTransactionSize, approvalThreshold },
      { headers: this.getHeaders() }
    );
  }

  async getTransactions(): Promise<LocusTransaction[]> {
    const response = await axios.get(
      `${this.baseUrl}/wallet/transactions`,
      { headers: this.getHeaders() }
    );
    return response.data.transactions;
  }

  async createWallet(): Promise<{ address: string; apiKey: string }> {
    const response = await axios.post(
      `${this.baseUrl}/wallet/create`,
      {},
      { headers: this.getHeaders() }
    );
    return {
      address: response.data.address,
      apiKey: response.data.api_key,
    };
  }
}

export const locusClient = new LocusClient();
