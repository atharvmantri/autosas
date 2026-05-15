export interface PricingTier {
  name: string;
  price: number;
  features: string[];
  isPopular: boolean;
}

export interface BusinessPlan {
  id: string;
  name: string;
  description: string;
  targetMarket: string;
  coreFeature: string;
  pricingTiers: PricingTier[];
  status: 'planning' | 'researching' | 'building' | 'marketing' | 'live' | 'winding-down' | 'closed';
}

export interface Transaction {
  id: string;
  type: 'revenue' | 'expense';
  amount: number;
  currency: string;
  timestamp: string;
  description: string;
  agentReasoning: string;
}

export interface AgentStatus {
  agentName: string;
  status: 'idle' | 'working' | 'error';
  currentTask: string;
  lastUpdate: string;
}

export interface Competitor {
  name: string;
  url: string;
  pricing: string;
  features: string[];
}

export interface ResearchResult {
  competitors: Competitor[];
  marketSize: string;
  recommendedPrice: number;
  goNoGo: 'go' | 'no-go';
}

export interface FinancialReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  transactions: Transaction[];
}

export interface BusinessState {
  plan: BusinessPlan;
  transactions: Transaction[];
  agentStatuses: AgentStatus[];
  deployedUrl: string | null;
  checkoutSessionId: string | null;
  revenue: number;
  expenses: number;
  researchResult?: ResearchResult;
}

export interface ActivityLogEntry {
  id: string;
  businessId: string;
  agentName: string;
  action: string;
  details: string;
  timestamp: string;
}
