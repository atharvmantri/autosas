import fs from 'fs';
import path from 'path';
import { BusinessState, Transaction, AgentStatus, ActivityLogEntry } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'businesses');
const ACTIVITY_DIR = path.join(process.cwd(), 'data', 'activity');

export class BusinessStateManager {
  private ensureDirs(): void {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(ACTIVITY_DIR)) fs.mkdirSync(ACTIVITY_DIR, { recursive: true });
  }

  private getStatePath(businessId: string): string {
    return path.join(DATA_DIR, businessId, 'state.json');
  }

  private getActivityPath(businessId: string): string {
    return path.join(ACTIVITY_DIR, `${businessId}.json`);
  }

  async create(businessId: string, initialState: BusinessState): Promise<void> {
    this.ensureDirs();
    const dir = path.join(DATA_DIR, businessId);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    await this.save(businessId, initialState);
  }

  async load(businessId: string): Promise<BusinessState | null> {
    const statePath = this.getStatePath(businessId);
    if (!fs.existsSync(statePath)) return null;
    const data = fs.readFileSync(statePath, 'utf-8');
    return JSON.parse(data) as BusinessState;
  }

  async save(businessId: string, state: BusinessState): Promise<void> {
    this.ensureDirs();
    const statePath = this.getStatePath(businessId);
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  }

  async addTransaction(businessId: string, transaction: Transaction): Promise<void> {
    const state = await this.load(businessId);
    if (!state) throw new Error(`Business ${businessId} not found`);
    state.transactions.push(transaction);
    if (transaction.type === 'revenue') {
      state.revenue += transaction.amount;
    } else {
      state.expenses += transaction.amount;
    }
    await this.save(businessId, state);
  }

  async updateAgentStatus(businessId: string, agentStatus: AgentStatus): Promise<void> {
    const state = await this.load(businessId);
    if (!state) throw new Error(`Business ${businessId} not found`);
    const existingIndex = state.agentStatuses.findIndex(a => a.agentName === agentStatus.agentName);
    if (existingIndex >= 0) {
      state.agentStatuses[existingIndex] = agentStatus;
    } else {
      state.agentStatuses.push(agentStatus);
    }
    await this.save(businessId, state);
  }

  async getFinancials(businessId: string): Promise<{ revenue: number; expenses: number; netProfit: number; transactions: Transaction[] }> {
    const state = await this.load(businessId);
    if (!state) throw new Error(`Business ${businessId} not found`);
    return {
      revenue: state.revenue,
      expenses: state.expenses,
      netProfit: state.revenue - state.expenses,
      transactions: state.transactions,
    };
  }

  async listAll(): Promise<BusinessState[]> {
    this.ensureDirs();
    if (!fs.existsSync(DATA_DIR)) return [];
    const dirs = fs.readdirSync(DATA_DIR);
    const states: BusinessState[] = [];
    for (const dir of dirs) {
      const state = await this.load(dir);
      if (state) states.push(state);
    }
    return states;
  }

  async logActivity(entry: ActivityLogEntry): Promise<void> {
    this.ensureDirs();
    const activityPath = this.getActivityPath(entry.businessId);
    let entries: ActivityLogEntry[] = [];
    if (fs.existsSync(activityPath)) {
      const data = fs.readFileSync(activityPath, 'utf-8');
      entries = JSON.parse(data);
    }
    entries.push(entry);
    fs.writeFileSync(activityPath, JSON.stringify(entries, null, 2));
  }

  async getActivity(businessId: string): Promise<ActivityLogEntry[]> {
    const activityPath = this.getActivityPath(businessId);
    if (!fs.existsSync(activityPath)) return [];
    const data = fs.readFileSync(activityPath, 'utf-8');
    return JSON.parse(data) as ActivityLogEntry[];
  }
}

export const businessStateManager = new BusinessStateManager();
