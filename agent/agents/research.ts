import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { BusinessPlan, ResearchResult, Competitor } from '@shared/types';
import { searchWeb, analyzeCompetitor } from '../tools/search';

const RESEARCH_PROMPT_PATH = path.join(process.cwd(), 'agent', 'prompts', 'research.md');

export class ResearchAgent {
  private llm: OpenAI;
  private systemPrompt: string;

  constructor(apiKey?: string) {
    this.llm = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY || '' });
    this.systemPrompt = fs.readFileSync(RESEARCH_PROMPT_PATH, 'utf-8');
  }

  async validate(plan: BusinessPlan): Promise<ResearchResult> {
    console.log(`[Research] Validating: ${plan.name}`);

    const searchResults = await searchWeb(`competitors ${plan.targetMarket} SaaS`);
    const competitors: Competitor[] = [];

    for (const result of searchResults.slice(0, 3)) {
      try {
        const info = await analyzeCompetitor(result.url);
        competitors.push({ name: info.name, url: result.url, pricing: info.pricing, features: info.features });
      } catch {
        competitors.push({ name: result.title, url: result.url, pricing: 'Unknown', features: [] });
      }
    }

    const competitorData = JSON.stringify(competitors);
    const response = await this.llm.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: `Analyze these competitors for "${plan.name}": ${competitorData}. Recommend pricing and go/no-go.` },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content) as Partial<ResearchResult>;

    return {
      competitors: result.competitors || competitors,
      marketSize: result.marketSize || 'Unknown',
      recommendedPrice: result.recommendedPrice || 9,
      goNoGo: result.goNoGo || 'go',
    };
  }
}
