import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { BusinessPlan, ResearchResult, BusinessState } from '@shared/types';
import { businessStateManager } from '@shared/state';
import { ResearchAgent } from './agents/research';
import { BuildAgent } from './agents/builder';
import { MarketingAgent } from './agents/marketing';
import { FinanceAgent } from './agents/finance';
import { SupportAgent } from './agents/support';

const CEO_PROMPT_PATH = path.join(process.cwd(), 'agent', 'prompts', 'ceo.md');

function loadPrompt(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

export class CEOAgent {
  private llm: OpenAI;
  private systemPrompt: string;
  private researchAgent: ResearchAgent;
  private buildAgent: BuildAgent;
  private marketingAgent: MarketingAgent;
  private financeAgent: FinanceAgent;
  private supportAgent: SupportAgent;

  constructor(apiKey?: string) {
    this.llm = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY || '' });
    this.systemPrompt = loadPrompt(CEO_PROMPT_PATH);
    this.researchAgent = new ResearchAgent();
    this.buildAgent = new BuildAgent();
    this.marketingAgent = new MarketingAgent();
    this.financeAgent = new FinanceAgent();
    this.supportAgent = new SupportAgent();
  }

  async parsePrompt(prompt: string): Promise<BusinessPlan> {
    const response = await this.llm.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: `Create a business plan for: ${prompt}` },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const plan = JSON.parse(content) as Partial<BusinessPlan>;

    return {
      id: plan.id || `biz_${Date.now()}`,
      name: plan.name || 'Untitled SaaS',
      description: plan.description || '',
      targetMarket: plan.targetMarket || '',
      coreFeature: plan.coreFeature || '',
      pricingTiers: plan.pricingTiers || [],
      status: 'planning',
    };
  }

  async executePlan(plan: BusinessPlan): Promise<void> {
    const businessId = plan.id;
    const initialState: BusinessState = {
      plan,
      transactions: [],
      agentStatuses: [],
      deployedUrl: null,
      checkoutSessionId: null,
      revenue: 0,
      expenses: 0,
    };
    await businessStateManager.create(businessId, initialState);

    this.logDecision(businessId, 'Starting business execution', `Plan: ${plan.name}`);

    // Step 1: Research
    plan.status = 'researching';
    await businessStateManager.save(businessId, { ...initialState, plan });
    await businessStateManager.updateAgentStatus(businessId, {
      agentName: 'ResearchAgent',
      status: 'working',
      currentTask: 'Validating market',
      lastUpdate: new Date().toISOString(),
    });
    const researchResult = await this.researchAgent.validate(plan);
    initialState.researchResult = researchResult;
    await businessStateManager.save(businessId, initialState);
    this.logDecision(businessId, 'Research complete', `Go/No-Go: ${researchResult.goNoGo}`);

    if (researchResult.goNoGo === 'no-go') {
      this.logDecision(businessId, 'Winding down', 'Market validation failed');
      plan.status = 'winding-down';
      await businessStateManager.save(businessId, initialState);
      return;
    }

    // Step 2: Finance setup
    await businessStateManager.updateAgentStatus(businessId, {
      agentName: 'FinanceAgent',
      status: 'working',
      currentTask: 'Setting up wallet',
      lastUpdate: new Date().toISOString(),
    });
    await this.financeAgent.setupWallet(businessId);
    this.logDecision(businessId, 'Finance setup complete', 'Wallet and spending rules configured');

    // Step 3: Build
    plan.status = 'building';
    await businessStateManager.save(businessId, initialState);
    await businessStateManager.updateAgentStatus(businessId, {
      agentName: 'BuildAgent',
      status: 'working',
      currentTask: 'Building and deploying SaaS',
      lastUpdate: new Date().toISOString(),
    });
    const deployResult = await this.buildAgent.build(plan, researchResult);
    initialState.deployedUrl = deployResult.url;
    initialState.checkoutSessionId = deployResult.checkoutSessionId;
    await businessStateManager.save(businessId, initialState);
    this.logDecision(businessId, 'Build complete', `Deployed at: ${deployResult.url}`);

    // Step 4: Marketing
    plan.status = 'marketing';
    await businessStateManager.save(businessId, initialState);
    await businessStateManager.updateAgentStatus(businessId, {
      agentName: 'MarketingAgent',
      status: 'working',
      currentTask: 'Generating marketing content',
      lastUpdate: new Date().toISOString(),
    });
    const marketingContent = await this.marketingAgent.generate(plan, researchResult);
    this.logDecision(businessId, 'Marketing content generated', `${marketingContent.socialPosts.length} social posts created`);

    // Step 5: Support
    await businessStateManager.updateAgentStatus(businessId, {
      agentName: 'SupportAgent',
      status: 'working',
      currentTask: 'Setting up support system',
      lastUpdate: new Date().toISOString(),
    });
    await this.supportAgent.setup(businessId);
    this.logDecision(businessId, 'Support system ready', 'Support agent initialized');

    // Mark as live
    plan.status = 'live';
    await businessStateManager.save(businessId, initialState);
    this.logDecision(businessId, 'Business is LIVE', `${plan.name} is now operational`);
  }

  async monitorBusiness(businessId: string): Promise<void> {
    const state = await businessStateManager.load(businessId);
    if (!state) return;

    const netProfit = state.revenue - state.expenses;
    if (netProfit < 0 && state.plan.status === 'live') {
      this.logDecision(businessId, 'Business losing money', `Net profit: $${netProfit}. Evaluating wind-down.`);
    }
  }

  logDecision(businessId: string, decision: string, reasoning: string): void {
    const entry = {
      id: `act_${Date.now()}`,
      businessId,
      agentName: 'CEOAgent',
      action: decision,
      details: reasoning,
      timestamp: new Date().toISOString(),
    };
    businessStateManager.logActivity(entry);
    console.log(`[CEO] ${decision} — ${reasoning}`);
  }
}
