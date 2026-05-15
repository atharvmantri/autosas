import { CEOAgent } from './orchestrator';

async function main() {
  const prompt = process.argv.slice(2).join(' ');
  if (!prompt) {
    console.log('Usage: npm run run:agent -- "your business idea"');
    process.exit(1);
  }

  console.log('=== AutoSaaS CEO Agent ===');
  console.log(`Prompt: ${prompt}`);
  console.log('');

  const ceo = new CEOAgent();

  try {
    console.log('[CEO] Parsing prompt into business plan...');
    const plan = await ceo.parsePrompt(prompt);
    console.log(`[CEO] Business Plan: ${plan.name}`);
    console.log(`[CEO] Target Market: ${plan.targetMarket}`);
    console.log(`[CEO] Core Feature: ${plan.coreFeature}`);
    console.log(`[CEO] Pricing Tiers: ${plan.pricingTiers.length}`);
    console.log('');

    console.log('[CEO] Executing plan...');
    await ceo.executePlan(plan);
    console.log('');
    console.log(`[CEO] Business ${plan.id} is now operational!`);
    console.log(`[CEO] Deployed at: ${plan.status}`);
  } catch (error) {
    console.error('[CEO] Error:', error);
    process.exit(1);
  }
}

main();
