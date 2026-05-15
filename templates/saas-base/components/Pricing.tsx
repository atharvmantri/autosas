'use client';

import { PricingTier } from '@shared/types';

interface PricingProps {
  tiers: PricingTier[];
}

export default function Pricing({ tiers }: PricingProps) {
  const handleCheckout = async (tier: PricingTier) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierName: tier.name, amount: String(tier.price), description: `${tier.name} Plan` }),
      });
      const data = await response.json();
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-xl p-8 shadow-lg ${tier.isPopular ? 'ring-2 ring-blue-500 scale-105' : ''}`}
            >
              {tier.isPopular && (
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Popular</span>
              )}
              <h3 className="text-2xl font-bold mt-4">{tier.name}</h3>
              <p className="text-4xl font-bold my-4">
                ${tier.price}<span className="text-lg text-gray-500 font-normal">/mo</span>
              </p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(tier)}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  tier.isPopular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
