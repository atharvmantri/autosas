# AutoSaaS

> The AI founder that builds, launches, and operates micro-SaaS businesses end-to-end.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. Run the dashboard:
   ```bash
   npm run dev:dashboard
   ```

4. Run the SaaS template:
   ```bash
   npm run dev:saas
   ```

5. Launch a business via the agent:
   ```bash
   npm run run:agent -- "Build a SaaS that turns YouTube videos into Twitter threads"
   ```

## Project Structure

```
autosas/
├── agent/              # AI agent framework
│   ├── orchestrator.ts # CEO agent
│   ├── agents/         # Sub-agents (Research, Build, Marketing, Finance, Support)
│   ├── prompts/        # System prompts per agent
│   └── tools/          # Agent tools (wallet, checkout, deploy, search)
├── templates/          # SaaS templates
│   ├── saas-base/      # Reusable micro-SaaS template
│   └── threadcraft/    # YouTube → Twitter threads SaaS
├── dashboard/          # AutoSaaS monitoring dashboard
├── shared/             # Shared types, state management, Locus client
├── data/               # Business state and activity logs
└── assets/             # Screenshots and branding
```

## Tech Stack

- **Agent Framework**: Node.js + OpenAI GPT-4o-mini
- **SaaS Template**: Next.js (App Router) + TailwindCSS
- **Payments**: Locus Checkout (@withlocus/checkout-react)
- **Deployment**: BuildWithLocus (Railway integration)
- **Dashboard**: Next.js + real-time updates

## Hackathon

- **Event**: Locus' Paygentic Hackathon #4
- **Track**: Using LocusFounder to Build a Business!
