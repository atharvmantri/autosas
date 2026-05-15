'use client';

import { useState } from 'react';
import BusinessCard from '../components/BusinessCard';
import RevenueChart from '../components/RevenueChart';
import TransactionTable from '../components/TransactionTable';
import AgentStatusPanel from '../components/AgentStatus';

interface Business {
  id: string;
  name: string;
  status: string;
  revenue: number;
  expenses: number;
  deployedUrl: string | null;
}

const demoBusinesses: Business[] = [
  { id: '1', name: 'ThreadCraft', status: 'live', revenue: 9, expenses: 0.5, deployedUrl: 'https://threadcraft.railway.app' },
];

const demoAgents = [
  { agentName: 'CEOAgent', status: 'idle' as const, currentTask: 'Monitoring businesses', lastUpdate: new Date().toISOString() },
  { agentName: 'ResearchAgent', status: 'idle' as const, currentTask: 'Awaiting new idea', lastUpdate: new Date().toISOString() },
  { agentName: 'BuildAgent', status: 'idle' as const, currentTask: 'Template ready', lastUpdate: new Date().toISOString() },
  { agentName: 'MarketingAgent', status: 'idle' as const, currentTask: 'Content scheduled', lastUpdate: new Date().toISOString() },
  { agentName: 'FinanceAgent', status: 'idle' as const, currentTask: 'Tracking P&L', lastUpdate: new Date().toISOString() },
  { agentName: 'SupportAgent', status: 'idle' as const, currentTask: 'No tickets', lastUpdate: new Date().toISOString() },
];

const demoRevenueData = [
  { day: 'Mon', revenue: 0, expenses: 0 },
  { day: 'Tue', revenue: 9, expenses: 0.5 },
  { day: 'Wed', revenue: 18, expenses: 1 },
  { day: 'Thu', revenue: 27, expenses: 1.5 },
  { day: 'Fri', revenue: 36, expenses: 2 },
];

const demoTransactions = [
  { id: 'tx1', type: 'revenue' as const, amount: 9, currency: 'USDC', timestamp: new Date().toISOString(), description: 'ThreadCraft Pro subscription', agentReasoning: 'Customer signed up via checkout' },
  { id: 'tx2', type: 'expense' as const, amount: 0.5, currency: 'USDC', timestamp: new Date().toISOString(), description: 'OpenAI API cost', agentReasoning: 'Thread generation for customer' },
];

export default function DashboardHome() {
  const [prompt, setPrompt] = useState('');
  const [launching, setLaunching] = useState(false);

  const handleLaunch = async () => {
    if (!prompt.trim()) return;
    setLaunching(true);
    try {
      await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
    } catch (error) {
      console.error('Launch error:', error);
    }
    setLaunching(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AutoSaaS Dashboard</h1>
          <span className="text-sm text-gray-500">The AI Founder</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <h2 className="text-lg font-bold mb-2">Launch a New Business</h2>
          <p className="text-gray-500 text-sm mb-4">Describe your SaaS idea and the AI founder will build it.</p>
          <div className="flex space-x-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 border rounded-lg p-3"
              placeholder='e.g., "Build a SaaS that turns YouTube videos into Twitter threads"'
            />
            <button
              onClick={handleLaunch}
              disabled={launching}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {launching ? 'Launching...' : 'Launch Business'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Active Businesses</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {demoBusinesses.map((biz) => (
                  <BusinessCard key={biz.id} {...biz} />
                ))}
              </div>
            </div>

            <RevenueChart data={demoRevenueData} />
            <TransactionTable transactions={demoTransactions} />
          </div>

          <div>
            <AgentStatusPanel agents={demoAgents} />
          </div>
        </div>
      </main>
    </div>
  );
}
