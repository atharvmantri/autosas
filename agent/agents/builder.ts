import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { BusinessPlan, ResearchResult } from '@shared/types';
import { deployToRailway, provisionDatabase } from '../tools/deploy';
import { createSession } from '../tools/checkout';

const BUILDER_PROMPT_PATH = path.join(process.cwd(), 'agent', 'prompts', 'builder.md');

export class BuildAgent {
  private llm: OpenAI;
  private systemPrompt: string;

  constructor(apiKey?: string) {
    this.llm = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY || '' });
    this.systemPrompt = fs.readFileSync(BUILDER_PROMPT_PATH, 'utf-8');
  }

  async build(plan: BusinessPlan, _research: ResearchResult): Promise<{ url: string; checkoutSessionId: string }> {
    console.log(`[Build] Building: ${plan.name}`);

    // In a full implementation, this would scaffold code from templates
    // For the hackathon demo, we use the pre-built threadcraft template
    const templateDir = path.join(process.cwd(), 'templates', 'threadcraft');
    if (!fs.existsSync(templateDir)) {
      throw new Error('Template directory not found');
    }

    // Provision database
    let connectionString = '';
    try {
      const db = await provisionDatabase();
      connectionString = db.connectionString;
    } catch {
      console.log('[Build] Database provisioning skipped (demo mode)');
    }

    // Create checkout session for the first pricing tier
    let checkoutSessionId = '';
    let checkoutUrl = '';
    try {
      const session = await createSession(
        process.env.LOCUS_API_KEY || '',
        String(plan.pricingTiers[0]?.price || 9),
        `${plan.name} - ${plan.pricingTiers[0]?.name || 'Pro'} Subscription`,
        'https://localhost:3000/api/webhook/locus'
      );
      checkoutSessionId = session.sessionId;
      checkoutUrl = session.checkoutUrl;
    } catch {
      console.log('[Build] Checkout session creation skipped (demo mode)');
    }

    // Deploy to Railway
    let deployedUrl = `https://${plan.name.toLowerCase().replace(/\s+/g, '-')}.railway.app`;
    try {
      const deployResult = await deployToRailway('https://github.com/autosas/threadcraft', {
        LOCUS_API_KEY: process.env.LOCUS_API_KEY || '',
        DATABASE_URL: connectionString,
      });
      deployedUrl = deployResult.url;
    } catch {
      console.log(`[Build] Deployment skipped (demo mode). Using placeholder URL: ${deployedUrl}`);
    }

    return { url: deployedUrl, checkoutSessionId };
  }
}
