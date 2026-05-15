import Hero from '../components/Hero';
import Pricing from '../components/Pricing';

interface PricingTier {
  name: string;
  price: number;
  features: string[];
  isPopular: boolean;
}

const threadcraftTiers: PricingTier[] = [
  { name: 'Free', price: 0, features: ['1 conversion per month', 'Basic thread format', 'Email support'], isPopular: false },
  { name: 'Pro', price: 9, features: ['Unlimited conversions', 'AI-optimized threads', 'Hashtag suggestions', 'Priority support'], isPopular: true },
  { name: 'Team', price: 29, features: ['Everything in Pro', 'Bulk processing', 'Team collaboration', 'Analytics dashboard', 'Custom branding'], isPopular: false },
];

export default function Home() {
  return (
    <main>
      <Hero
        title="Turn YouTube Videos into Viral Twitter Threads"
        subtitle="AI-powered extraction that transforms any YouTube video into engaging, ready-to-post Twitter threads in seconds."
        ctaText="Start Free"
      />

      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'AI-Powered Extraction', desc: 'Automatically extracts key points and transforms them into engaging thread format.' },
            { title: 'Thread Formatting', desc: 'Optimized for Twitter\'s character limits with natural flow and hooks.' },
            { title: 'One-Click Export', desc: 'Copy to clipboard or schedule directly to your Twitter account.' },
          ].map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Pricing tiers={threadcraftTiers} />

      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>Built by AutoSaaS — ThreadCraft</p>
      </footer>
    </main>
  );
}
