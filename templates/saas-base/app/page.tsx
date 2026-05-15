import Hero from '../components/Hero';
import Pricing from '../components/Pricing';

interface PricingTier {
  name: string;
  price: number;
  features: string[];
  isPopular: boolean;
}

const defaultTiers: PricingTier[] = [
  { name: 'Free', price: 0, features: ['1 use per month', 'Basic features', 'Email support'], isPopular: false },
  { name: 'Pro', price: 9, features: ['Unlimited uses', 'All features', 'Priority support', 'API access'], isPopular: true },
  { name: 'Team', price: 29, features: ['Everything in Pro', 'Team collaboration', 'Admin dashboard', 'Custom integrations'], isPopular: false },
];

export default function Home() {
  return (
    <main>
      <Hero
        title="Your Micro SaaS"
        subtitle="The fastest way to solve your problem. Built by AI, trusted by humans."
        ctaText="Get Started Free"
      />

      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Lightning Fast', desc: 'Get results in seconds, not hours.' },
            { title: 'AI-Powered', desc: 'Built with cutting-edge AI technology.' },
            { title: 'Affordable', desc: 'Start free, scale when you need to.' },
          ].map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Pricing tiers={defaultTiers} />

      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>Built by AutoSaaS — The AI founder</p>
      </footer>
    </main>
  );
}
