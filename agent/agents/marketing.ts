import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { BusinessPlan, ResearchResult } from '@shared/types';

const MARKETING_PROMPT_PATH = path.join(process.cwd(), 'agent', 'prompts', 'marketing.md');

export interface MarketingContent {
  landingPage: { hero: string; features: string[]; cta: string };
  socialPosts: string[];
  blogPosts: string[];
  emailSequence: string[];
}

export class MarketingAgent {
  private llm: OpenAI;
  private systemPrompt: string;

  constructor(apiKey?: string) {
    this.llm = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY || '' });
    this.systemPrompt = fs.readFileSync(MARKETING_PROMPT_PATH, 'utf-8');
  }

  async generate(plan: BusinessPlan, _research: ResearchResult): Promise<MarketingContent> {
    console.log(`[Marketing] Generating content for: ${plan.name}`);

    const response = await this.llm.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: `Generate marketing content for "${plan.name}" — ${plan.description}. Target: ${plan.targetMarket}. Core feature: ${plan.coreFeature}.` },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content) as Partial<MarketingContent>;

    return {
      landingPage: parsed.landingPage || { hero: `Transform your workflow with ${plan.name}`, features: [], cta: 'Get Started Free' },
      socialPosts: parsed.socialPosts || [`Check out ${plan.name} — ${plan.coreFeature}!`],
      blogPosts: parsed.blogPosts || [`Why ${plan.targetMarket} needs ${plan.name}`],
      emailSequence: parsed.emailSequence || [`Welcome to ${plan.name}!`],
    };
  }
}
