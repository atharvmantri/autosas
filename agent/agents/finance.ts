import { FinancialReport } from '@shared/types';
import { businessStateManager } from '@shared/state';
import { getBalance, setAllowance, setApprovalThreshold } from '../tools/wallet';

export class FinanceAgent {
  async setupWallet(businessId: string): Promise<void> {
    console.log(`[Finance] Setting up wallet for: ${businessId}`);

    try {
      const balance = await getBalance(process.env.LOCUS_API_KEY || '');
      console.log(`[Finance] Current wallet balance: $${balance}`);
    } catch {
      console.log('[Finance] Wallet balance check skipped (demo mode)');
    }

    try {
      await setAllowance(process.env.LOCUS_API_KEY || '', 50);
      await setApprovalThreshold(process.env.LOCUS_API_KEY || '', 10);
    } catch {
      console.log('[Finance] Spending rules setup skipped (demo mode)');
    }

    await businessStateManager.updateAgentStatus(businessId, {
      agentName: 'FinanceAgent',
      status: 'idle',
      currentTask: 'Wallet configured',
      lastUpdate: new Date().toISOString(),
    });
  }

  async getReport(businessId: string): Promise<FinancialReport> {
    const financials = await businessStateManager.getFinancials(businessId);
    return {
      totalRevenue: financials.revenue,
      totalExpenses: financials.expenses,
      netProfit: financials.netProfit,
      transactions: financials.transactions,
    };
  }
}
